// ==UserScript==
// @name         QQ音乐播放器美化
// @version      0.1.8
// @description  美化QQ音乐播放页面
// @author       Mikkpotatoes
// @match        https://y.qq.com/*
// @icon         https://y.qq.com/favicon.ico
// @grant        none
// @namespace https://greasyfork.org/users/805106
// @downloadURL https://update.greasyfork.org/scripts/430871/QQ%E9%9F%B3%E4%B9%90%E6%92%AD%E6%94%BE%E5%99%A8%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/430871/QQ%E9%9F%B3%E4%B9%90%E6%92%AD%E6%94%BE%E5%99%A8%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

var lrcc = false;
var hideMouse;
var bodybg = {
    background: null,
    album: null
};

function hidePlayer() {
    let player = document.querySelector("#app");
    if (document.querySelector(".player-action").classList.contains("hide-player")) {
        player.style.top = "calc(100vh - 64px)";
        document.querySelector(".player__ft").classList.add("bar-mode");
        document.querySelector(".player-bar").classList.add("show-bar");
        document.querySelector("#content").style.height = "";
        document.querySelector(".lyric-bar").style.bottom = "";
        document.querySelector(".lyric-bar").style.opacity = "";
        let cl = document.querySelector(".player-action").classList;
        cl.add("show-player");
        cl.remove("hide-player");
    } else {
        player.style.top = "";
        document.querySelector(".player__ft").classList.remove("bar-mode");
        document.querySelector(".player-bar").classList.remove("show-bar");
        document.querySelector("#content").style.height = "0";
        document.querySelector(".lyric-bar").style.bottom = "100%";
        document.querySelector(".lyric-bar").style.opacity = "0";
        let cl = document.querySelector(".player-action").classList;
        cl.remove("show-player");
        cl.add("hide-player");
    }
}

function hidePlayList(s) {
    let cl = document.querySelector(".btn_play_list").classList;
    if (cl.contains("play_list_open")) {
        // document.querySelector(".mod_songlist_toolbar").style.bottom = "-280px";
        // document.querySelector(".sb_main").style.bottom = "-700px";
        document.querySelector(".songlist-box").style.transform = "translate(0, calc(100% + 140px))";
        setTimeout(() => {
            document.querySelector(".songlist-overlay").style.display = "none";
        }, 1000);
        cl.remove("play_list_open");
    } else {
        // if(s == true) {
        // document.querySelector(".mod_songlist_toolbar").style.bottom = "";
        // document.querySelector(".sb_main").style.bottom = "";
        document.querySelector(".songlist-overlay").style.display = "";
        setTimeout(() => {
            document.querySelector(".songlist-box").style.transform = "";
        }, 10);
        cl.add("play_list_open");
        // }
    }
}

function setLrc(_e, v) {
    v = v == undefined ? lrcc : v;
    if (v) {
        // console.log("exted!");
        return;
    }
    if (!document.querySelector("audio").paused) {
        lrcc = true
        setTimeout(setLrc, 50, _e, v);
    } else {
        lrcc = false;
    }

    let lrc = document.querySelector(".lyric-bar>p");
    if (lrc == null) {
        lrc = document.createElement("p");
        document.querySelector(".lyric-bar").append(lrc);
    }
    if (document.querySelector(".on")) lrc.innerHTML = document.querySelector(".on").innerHTML;
}

function getSongListData() {
    return JSON.parse(localStorage.playSongData).value;
}

function getPlayingSong() {
    let data = getSongListData();
    return data.songList[data.index]
}

function playNextSong(next) {
    let st = document.querySelector("#content").contentWindow.localStorage;
    let data = getSongListData();
    // let oldval = getSongListData();
    let index = data.index;
    if (next) {
        data.index = index < data.songList.length - 1 ? index + 1 : 0;
    } else {
        data.index = index > 0 ? index - 1 : data.songList.length - 1;
    }
    data.time = (new Date()).getTime();
    st.playSongData = JSON.stringify({
        value: data
    });
}

function updateMediaInfo() {
    navigator.mediaSession.metadata = new MediaMetadata({
        title: getPlayingSong().name,
        artist: (() => {
            let singer = "";
            getPlayingSong().singer.forEach(v => {
                singer = singer == "" ? "" : singer + " / "
                singer += v.name
            });
            return singer;
        })(),
        album: getPlayingSong().album.name,
        artwork: [{
            src: document.querySelector(".song_info__pic").src
        }]
    });
}

function imgLsr() {
    let e = document.querySelector(".song_info__pic");
    let cb = document.querySelector(".cover-blur");
    if (!cb) {
        cb = document.createElement("style");
        cb.classList.add("cover-blur");
        document.head.append(cb);
    }
    if (document.querySelector(".bar-cover")) {
        document.querySelector(".bar-cover").src = e.src;
    }
    cb.innerHTML = ".song_info__cover::after{background: url(" + e.src + ") no-repeat}"
};

function escapChar() {
    let i = document.createElement("i");
    document.querySelectorAll("#qrc_ctn>p").forEach(e => {
        i.innerHTML = e.childNodes[0].nodeValue;
        e.childNodes[0].nodeValue = i.innerText;
    });
}

function setDown() {
    fetch(document.querySelector("audio").src.replace(/^http/, "https"))
        .then((data) => {
            return data.blob()
        })
        .then((e) => {
            let dbtn = document.querySelector(".download");
            dbtn.href = window.URL.createObjectURL(e);
            dbtn.download = document.querySelector(".player_music__info").innerText;
        });
}

function fullScreen() {
    if (!document.querySelector(".player-action").classList.contains("hide-player")) hidePlayer();
    document.body.requestFullscreen();
}

(function () {
    'use strict';

    if (location.pathname == "/n/ryqq/player") {
        window.addEventListener("load", () => {
            let player = document.querySelector("#app");
            // Create play list button & set click event.
            let bps = document.querySelector(".btn_big_only");
            let bp = document.createElement("a");

            bp.classList.add("play_list_open", "btn_play_list");
            bps.after(bp);
            bps.remove();
            bp.innerHTML = "";
            let cl = bp.classList;
            cl.remove("btn_big_only");
            cl.add("btn_play_list");
            bp.addEventListener("click", hidePlayList)

            // Move play list element into a now element & set dismiss on click blank area
            let slover = document.createElement("div");
            slover.classList.add("songlist-overlay")
            let slbox = document.createElement("div");
            slbox.classList.add("songlist-box");
            slover.append(slbox);
            slbox.append(document.querySelector(".mod_songlist_toolbar"));
            slbox.append(document.querySelector(".sb_main"));
            document.querySelector("#app").append(slover);
            slover.addEventListener("click", e => {
                if (e.target.classList.contains("songlist-overlay")) hidePlayList();
            });

            let rg = document.createElement("div");
            rg.classList.add("song-action")
            rg.innerHTML = '···<div class="ring-btn full-screen" title="全屏"></div><a class="ring-btn download" title="下载"></a><div class="ring-btn settings" title="设置"></div>';
            document.body.append(rg);

            rg.addEventListener("mouseenter", e => e.target.classList.remove("btn-hide"));
            rg.addEventListener("mouseleave", e => e.target.classList.add("btn-hide"));
            document.querySelector(".full-screen").addEventListener("click", fullScreen);

            hidePlayList();
            // Load custom style sheet
            let s = document.createElement("style");
            s.innerHTML = '.player_login__guide{display:none}.mod_song_info{left:50%;width:100%;font-size:32px;line-height:56px;display:flex;flex-direction:row;align-items:center;max-width:1440px;transform:translate(-50%,0)}.song_info__cover:after{width:calc(100% - 16px);height:calc(100% - 16px);background-size:contain!important;z-index:-1;filter:blur(24px);top:24px}.song_info__pic{width:100%;height:100%;border-radius:8px}.song_info__album,.song_info__name,.song_info__singer{height:auto;font-size:24px;font-weight:700}.song_info__lyric{flex:1 0;height:100%;min-height:100%}.song_info__lyric,.song_info__lyric_box{position:unset}.song_info__lyric_box{margin-right:-20px}.song_info__lyric_inner{line-height:42px;font-weight:700;text-align:left;margin-top:50%}.song_info__lyric .on{color:#fff;opacity:1}.mod_songlist_toolbar{margin-left:0}.sb_viewport{height:420px;padding:0 0 0 24px;flex:1}.mod_only_lyric{font-size:32px;line-height:64px;font-weight:700}.player__bd{top:96px}.player_music{margin:0 316px 0 208px}@media (min-height:710px) and (max-height:900px){.song_info__lyric{top:unset}.song_info__lyric_box{height:auto;margin-top:-20%}}@media (min-height:1000px) and (max-height:1100px){.song_info__lyric_box{top:unset;margin-top:-20%;height:auto}}@supports (-webkit-appearance:none){.mod_songlist,.sb_overview{margin-right:-18px}}.btn_big_like{right:190px}.btn_big_down{display:none}.btn_big_style_list,.btn_big_style_order,.btn_big_style_random,.btn_big_style_single{top:2px;right:243px}.btn_play_list{top:3px;right:137px;width:26px;height:26px;background-position:0 -282px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAEx0lEQVR4nO3d3VHcSBQGUEIghAnBGawyWGewG4IzWGewzsBkwmQAGZgMTAbfPmhYUzZqA2p1T4/OqdILUEhz+34ltf7m6goAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARpTkQ5Jbi+UMlw+983GVZAqcp6l3PgSEcyYgUCAgUCAgUCAgUCAgUCAgUCAgUCAgUCAgUCAgUCAgUCAgUCAgUCAgUNA/IAAAAAAAAAAAAAAAAAAAAAAAAADABUpy7P3axdfoXSd2KgICyyIgsCwCAssiILAsAgLLIiCwLAICyyIgsCwCAssiILAsAgLLIiCwLAICyyIgsCx7CUiS6yR/WC5qua6Qgd/1TY2AHLdeanzQqcIH5bxMqxvj932zOiBbb2MVEZBLNDXoGwFhWFODvhEQhjU16BsBYVhTg74REIY1NegbAWFYU4O+ERCGNTXoGwFhWFODvhEQhjU16BsBYVhTg74REIY1NegbAWFYU4O+ERCGNTXoGwFhWFODvhEQhjU16JvdBOQ6c0gsl7MM8cDU1tsI3QgIFAgIFAgIFAgIFAgIFAgIFAgIFAgIFAgIFAgIFAgIFAgIFAgIFAgIFAgIFAgIFy/JIclfSf5Ncpvk2089/P3089vT3/yZ08NYAsJFOoXinyR3K3r7LnN4BITLkORDkq9rm7qm3jWBpz3G185ZeFHv2rBzST6mwqHQVnrXhx3Lme41nutdI3Yo82ucbjv3/qv0rhU7kzkca85ONdW7XuxMBtlzPOldL3YkA8w5fta7ZuxE5rNVw+ldN3Yg87zjbE/llvSuHTuQ5EvvRn+v3rXjwmW+fWRYvevHhUty07vJ1+hdPy5Y5rnH0HrXkAuW5PNGfXuf+VmPY5KHjdaRREDYUOpeMX/MHLjDC+s5nH73WHF9SQSEjaTu4dV9XvGVbZmDcl9xvQLCNlLvwuD9O9ZdLSRb1AZqXft4zDu+7DPznqTK4dYWtYEqL0xI8nnF+qucIKhYEvghdQJyWLH+Q4X1CwjbyPp7r94893hhG1afAq5RC/jF2sZMcqywDft4L1aSaX29edJozNY6VtgGAeHtGo3Z2rNIdxW24dvKbXioUIrtRUCqajRmlzBJP9aryIYiIFU1GrNLOM17rFeRDUVAqmo0ZjUa9Hvef6GwxhOMX7aoTXURkKoajVmtW03ePBdJvZskP25Rm+oiIFU1GrOaNyve5fU3K9a8g/jNe68uIiBVNRy3ms9qfM/8lQiHF9bz9HUJNV8MsfpCZTMRkKoajtunjT7CXX58ac63jdbxqVWdVouAVNVw3EZ+5HaMw6urKwGprfHYjfjShpuWNVotAlJV47GrcldtY4eWNVotAlJVh/Eb6cVxY1z7eC4CUlWH8bvOBi9U2MBDRpp7PImAVNVpDEd4efUYFwZ/FgGpquM4nvOh1niHVk8yv9/1aKmzdB7L45vato2bnjWB/2Wej1R9d9VKr3rnFjSTOSTnsCe5iXBwrtJ3TjLunIP9yHx2q+Up4IeMeraKfcp8yNVib/IlDqkYVebbUmrfu/V4+p+H3p8PqjgF5VPWne26P/0Pewwu1yksf2d+xv3pWs7zOcvDs59/zjynEQoAAAAAAAAAAAAAAAAAAAAAAAAA6vkPWUB8Iq0SK6MAAAAASUVORK5CYII=);background-size:100%;position:absolute}.play_list_open{opacity:1}.mod_btn_comment{display:none}.song_info__lyric_inner>p{max-width:350px;padding:12px 16px;border-radius:12px;opacity:.5}.song_info__lyric_inner>p:hover{background:rgba(255 255 255 / 25%)}.song_info__info{flex:1 0}.list_current .mod_playlist_text .playlist__title,.list_hover .mod_playlist_text .playlist__title{width:30.8986%}.mod_playlist_text .list_current .list_menu,.mod_playlist_text .list_hover .list_menu{position:static;float:left}.mod_playlist_text .playlist__time{position:absolute;right:10px;width:133px;top:0;color:#999}.mod_playlist_text .playlist__time span{position:relative;float:left;font-size:13px}.mod_songlist_toolbar{margin-bottom:0;padding:16px 24px}.song_info__cover{width:320px;height:320px}@media (min-height:900px) and (max-height:1000px){.song_info__lyric_box{height:auto}}.mod_songlist{display:flex;flex-direction:column;max-height:100%;overflow:hidden}.sb_overview{height:100%!important}ul.songlist__list{overflow-y:auto}@keyframes opacity{0%{opacity:0}100%{opacity:1}}@keyframes bar-out{0%{opacity:1;top:18px}50%{opacity:0;top:50%}90%{opacity:.5;top:unset}100%{opacity:1;top:unset}}.player-bar{justify-content:left;align-items:center;padding-left:3%;display:flex;height:64px;background:#fff;position:fixed;opacity:0;transition:.5s ease-out;width:100%;left:0}.show-bar{opacity:1;animation:1s 1 opacity ease-in}.bar-cover{width:48px;height:48px;box-shadow:0 2px 6px -1px rgba(0 0 0 / 50%);border-radius:5px}.bar-mode{z-index:16;top:18px;filter:brightness(0);animation:opacity 1s 1 ease-in}.mod_player{z-index:10}.lyric-bar{color:#333;text-align:center;font-size:17px;z-index:10;position:absolute;min-height:36px;overflow:hidden;width:100%;bottom:64px;background:#fff;display:flex;align-items:center;flex-direction:column;justify-content:flex-end;border-top:solid 1px #eee;transition:1s ease-in-out;max-height:48px;padding-bottom:4px}.lyric-bar>p{transition:.5s ease-out}@keyframes btn-up{0%{top:calc(100vh - 48px);transform:rotate(180deg);filter:brightness(0)}100%{top:18px;transform:rotate(0);filter:brightness(1)}}@keyframes btn-down{0%{top:18px;transform:rotate(0);filter:brightness(1)}100%{top:calc(100vh - 48px);transform:rotate(180deg);filter:brightness(0)}}.player-action{width:36px;height:36px;border-radius:8px;display:block;position:fixed;right:16px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAFZklEQVR4nO3dz4tVdRjH8asipoJpaokVBgWFVFQLW0REtIgW1iJsEUEURWVBQUG7Cvq5iwhaDNUiDAwDMyihmihcZJBELhKSEoqKJgJDRCT13eLMBRVnvNc553nO95z36x+43+d5/Mw49577fAcDSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkjQFYDWwEngE2A7cBS7LP1VfAhcCdJ83j1uwz9RJwP/AtM/sIuCX7nH0xHYY9M8ziCPABcE32OTsPWAl8N0swTvcuMD/73F0FrAP2jzGPl7PP3FnABWMOY+gz4Lzs83cNsB74+xzm8Xb22TsJ+OIchjE0aUjqA1wB/DWHeTyRXUOnAA/PYRgnh2RRdi2lAy4D/pjjLA4Da7Jr6YwaBjL0aXYtJQMuBQ7UNIs3suvpBGBDTQMZ2gkszK6rNMAa4Jca5/B7dk2dQPUWYt0MyRiAVcBPDczhouzaige82MBgAD7Orq0EVO8e7m1oBtdl11c84LmGhgOwA1iQXWNbAUsZ73Onca3PrrF4wCMNDghge3aNbUQVjt0N935ldp3FA65teEjgb5JTAIuArxvu+f7sOjsD+LnhYQF8mF1nWwCfB/T7tew6OwPYFDAwgG30+NktYAHwSUCf/wWWZ9fbKcD7AYODnoYEmA9sD+rxpux6Own4MmiAW7NrjUbcDyA/QW8K1R+Pk0GD3AbMy645AvBeUE+3ZNfaecSGZAsdDwkwEdTL3vzASUcVkl1Bg+1sSIA3g3q4gx7+XZcKWExgSLLrrRvwUlDvduJnTDmIDck72fXWBXg6qGc+FJoNQzIW4PGgXk1iONoBQzIS4KGgHu3Cb2+2C4ZkVsB9wImA3uwGFmfXqzMgNiRvZdc7KuAe4HhAT/YAS7Pr1SwwJKcA7gKOBfRiL7Asu16NAEMyGAwGA+AO4L+AHuwFVmTXqzHQ85BQ7Sk+GlD7PgxHmahC0vS34oZez653CLiZaidu0/YDq7Lr1RwQ89XRofSQADdSLWZr2gHcStIN9CQkwA3AoYAafwMuzqpTDSA2JK8m1HcVcDCgtj+BddH1KQAdDQnVMumpgJqmgMuj6lICOhYS6lkmPYop4Mqm61ELEBuS5xus4xLg14Aa/sFw9AuxIXm2gfPXvUx6JgeBq+s+vwpAoSGhuWXSpzsEXF/XuVUgCgsJsAL4MeCsh4ENdfRYhaMKyUy3tNbtyTmccxnwQ8AZjwA31dljFW76H19rQ0Lzm9aHjuL95joTWhoSqmfKvgk401Hg9iZ7rMIRG5JHRzhPxKZ1qB6LNxw6O1oSEmAhMZvWjwEbI3uswpEcEqpl0hGb1o8Dd2f0WIUjKSTAPGBrwGueAO7N7LEKB5xPXEgenH7NqGXSD2T3Vx0ALCcuJF8Fvc5j2X1VhxD7362mnfXdM2lsVCFp6s7wKOf8Sb50VlTPQpUakhey+6ceoMyQpC+UUI9QVkhat7dLPUAZISlu0bY6hHaHxHAoH+0MSeeujVPBaFdIvFFW7UM7QuKNsmqv5JB4o6zabzok+4LD4aWZKgfVap6okEzipZkqTVBIvFFW5Wo4JN4oq/I1FBJvlFV31BwSb5RV99QUEi/NVHfNMSRemqnuA1Yz/td3v8dLM9UXwBJgYsRwTABLss8shQPWAk9RLYk7cFIopoBXgLXZZ5QkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZKkUfwPA9EBv4stEe8AAAAASUVORK5CYII=) no-repeat center 1px;background-size:100%;cursor:pointer;z-index:1001;transition:.2s}.hide-player{top:18px}.show-player{transform:rotate(180deg);filter:brightness(0);top:calc(100vh - 48px)}.player-action:hover{background-color:rgba(255 255 255 / 20%)}#player{box-shadow:0 0 5px -1px rgba(0 0 0 / 50%);position:fixed;top:0;width:100%;height:100%;z-index:1000;border:none;transition:1s ease-in}.popup_guide{display:none}.show-player{animation:btn-down 1s 1 ease-in-out both}.hide-player{animation:btn-up 1s 1 running ease-in-out both}#content{width:100%;margin-bottom:100px;height:calc(100% - 100px);background-color:#fff;position:fixed;z-index:10;overflow:hidden;border:none;top:0;transition:1s ease-in-out}#app{top:0;left:0;z-index:11;position:fixed;width:100%;background-color:inherit;transition:1s ease-in-out;box-shadow:0 0 6px -1px rgba(0 0 0 / 50%);overflow:hidden}.mod_songlist_toolbar>*{filter:brightness(.4)!important}.mod_songlist_toolbar>*{filter:brightness(.4)!important}.sb_overview *{color:#000!important}.sb_overview .list_menu__item,.sb_overview .songlist__checkbox,.sb_overview .songlist__delete{filter:brightness(.2)}.hide-mouse{width:100%;height:100%;position:absolute;top:0;left:0;cursor:none;z-index:10}.list_menu__down{display:none}.sprite.songlist__edit{filter:brightness(.2)}.songlist__item--playing>.songlist__number{filter:brightness(.2)}.songlist-overlay{width:100%;height:100%;position:fixed;left:0;top:0;z-index:10}.songlist-box{width:880px;background:rgba(255 255 255 / 72%);backdrop-filter:blur(24px);border-radius:12px;position:absolute;bottom:136px;right:72px;height:560px;display:flex;flex-direction:column;transition:1s ease-in-out}.song-action{background:linear-gradient(135deg,#81fbb8 10%,#28c76f 100%);display:flex;width:48px;height:48px;/*! left: 100%; */position:fixed;z-index:100;right:0;top:50%;border-radius:50%;color:#fff;font-size:48px;font-weight:700;letter-spacing:-2px;padding-top:5px;box-sizing:border-box;align-items:center;justify-content:center;cursor:pointer;transform:translate(75%,-50%);box-shadow:0 0 6px 1px rgba(255 255 255 / 25%);opacity:.5;transition:.2s ease-in-out;--action:0}.song-action:hover{transform:translate(-4px,-50%);opacity:1;--action:1}.ring-btn{position:absolute;width:36px;height:36px;border-radius:50%;border:solid 1px #28c76f;outline:solid 2px #fff;opacity:var(--action);transition:.3s .1s ease-in-out;margin-top:-5px}.ring-btn:hover{box-shadow:-1px 1px 6px 2px rgba(255 255 255 / 60%)}.full-screen{background:#fff url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAEbUlEQVR4nO3dMYokdRTH8c4F001MhGGq2EuMJxDBGXBZRA9gVU2g0cqCmXdZRA9gsFFVBQZ6AidZVlYURTDVYAweD4PV+Xe96eLzgXeA/lV/qc76cAAAAAAAAAAAAAAAAAAAAAAAAACAf9Mtw+Nunr7u5/GmX6a/9nDdOlyW77oOl9U7NLt5vLn9jlw/qt51M7cPcHxZPr5ATuq6eXzRLdO71fse1fk8Pa0eWiCnfd0yfV698VH0y/hR9bgC2cedr+OH1Ts3dbYOb3bL9Fv1sEcPZJ6uqrfu5umqeoej77xMPz/44dM3qrduppunz6pH3eTBeYNsd/P0SfXWzfTLuJQPKpBdXTeP31Zv3Uy3jL9XD7rNQ/MTa8P7qXrrZu7BmNsE4g2y6VVv3Uz1kJsF4g0ikP+jekiB7POqt26mekiB7POqt26mekiB7POqt26mekiB7POqt26mekiB7POqt26mekiB7POqt27m7l+88VW/jM/v/c3DRfnW83BRvsNr3O0zFcjhcGgSyLPqz0Bb3Tw+E8g/BEImkEAgZAIJBEImkEAgZAIJBEImkEAgZAIJBEImkEAgZAIJBEImkEAgZAIJBEImkEAgZAIJBEImkEAgZAIJBEImkEAgZAIJBEImkEAgZAIJBEImkEAgZAIJBEImkEAgZAIJBEImkEAgZAIJBEImkEAgZAIJBEImkEAgZAIJBEImkEAgZAIJBEImkEAgZAIJBEImkEAgZAIJBEImkEAgZAIJBEImkEAgZAIJBEImkEAgZAIJ+uX6nbvc2To8rP4MtHW2Dg/v+r2o/gwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADACfAHOmT+QCfwF2xk/oItEAiZQAKBkAkkEAiZQAKBkAkkEAiZQAKBkAkkEAiZQAKBkAkkEAiZQAKBkAkkEAiZQAKBkAkkEAiZQAKBkAkkEAiZQAKBkAkkEAiZQAKBkAkkEAiZQAKBkAkkEAiZQAKBkAkkEAiZQAKBkAkkEAiZQAKBkAkkEAiZQAKBkAkkEAiZQAKBkAkkEAiZQAKBkAkkEAiZQAKBkAkkEAiZQAKBkAkkEAiZQAKBkAkkEAiZQAKBkAkkaBDIq34Zn9/7m4eL8q3n4aJ8h9e422cqkMPhcPdATuW6ebqq3rqbp6vqHba66q2bqR5SIPu86q2bqR5SIPu86q2bqR5SIPu86q2bqR5SIPu86q2bqR5SIPu86q2bqR5SIPu86q2bqR5ys0DW4bJ6624dLqt3EMh/1M/jr9VjbhKIN8iW90v11s10y/j9PRj0+IF4g2x443fVWzfTLdOX9YNuEIg3yHa3Tl9Ub93M2Tq81S3Tn+WjCmQfN49/vL1OD6q3bqpfrj8uH/bYgfiJtcmdr+MH1Tsfxfk8Pa0eVyCnfd0yPqne+Kj6dXq/X8aX1UML5LSum8cX5/P1e9X7bqZbhsfdPH7Tz+NN9fgCubf3Y79MX/Xz9aPqXQEAAAAAAAAAAAAAAAAAAAAAAAC4p/4GbsstE5pG500AAAAASUVORK5CYII=) center no-repeat;right:24px;top:calc(-100% + 10px);background-size:72%}.ring-btn.download{top:10px;right:calc(100% + 8px);background:#fff url(data:image/png;base64,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) center no-repeat;background-size:72%}.settings{top:calc(100% + 10px);right:24px;background:#fff url(data:image/png;base64,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) center no-repeat;background-size:72%;filter:grayscale(1);cursor:not-allowed;z-index:-1}.btn-hide>.ring-btn{top:5px!important;right:5px!important;opacity:0}';
            document.head.append(s);
            // Create music action bar
            let bar = document.createElement("div");
            bar.classList.add("player-bar");
            bar.innerHTML = '<img class="bar-cover">';
            document.querySelector(".mod_player").append(bar);

            imgLsr();

            let index = document.createElement("iframe");
            index.src = "/";
            index.setAttribute("id", "content");
            player.before(index);

            let pa = document.createElement("span");
            pa.classList.add("player-action", "show-player");
            document.body.append(pa);
            pa.addEventListener("click", hidePlayer);
            document.querySelector(".player-bar").classList.add("show-bar");
            let lrc_bar = document.createElement("div");
            lrc_bar.classList.add("lyric-bar");
            player.before(lrc_bar);
            let hm = document.createElement("div");
            hm.classList.add("hide-mouse");
            player.append(hm);
            hidePlayer();

            player.addEventListener("mousemove", () => {
                window.clearTimeout(hideMouse);
                document.querySelector(".hide-mouse").style.display = "none";
                hideMouse = setTimeout(() => {
                    document.querySelector(".hide-mouse").style.display = "";
                }, 5000);
            });

            // Switch transalte button and escape sercial char
            document.querySelector(".mod_song_info").addEventListener("click", e => {
                if (e.target.classList.contains("btn_lang")) setTimeout(escapChar, 10);
            });

            document.querySelector("audio").addEventListener("play", () => {
                setLrc();
                imgLsr();
                updateMediaInfo();
                escapChar();
                setDown();

                setTimeout(() => {
                    if (getPlayingSong().album.id != bodybg.id) {
                        let bg = document.body.style.backgroundColor;
                        bodybg.background = bg == bodybg.background ? "" : bg.replace(/rgba\((.+), (\d+|\d\+.\d+)\)/, "rgb($1)");
                        bodybg.album = getPlayingSong().album.id;
                        document.body.style.backgroundColor = bodybg.background;
                    }
                }, 100)
                document.title = document.querySelector(".player_music__info").innerText;
            });
        });

        // setLrc();

        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', () => document.querySelector("audio").play());
            navigator.mediaSession.setActionHandler('pause', () => document.querySelector("audio").pause());
            navigator.mediaSession.setActionHandler('seekbackward', () => {
                document.querySelector("audio").currentTime += 10;
            });
            navigator.mediaSession.setActionHandler('seekforward', () => {
                document.querySelector("audio").currentTime -= 10;
            });
            navigator.mediaSession.setActionHandler('previoustrack', () => {
                playNextSong(false);
            });
            navigator.mediaSession.setActionHandler('nexttrack', () => {
                playNextSong(true);
            });
        };
    } else {
        let s = document.createElement("style");
        s.innerHTML = 'li.top_nav__item:nth-child(3),.footer,.popup_guide,.btn_bottom_feedback,.btn_bottom_player {display: none;}';
        document.head.append(s);
    }
    // Your code here...
})();