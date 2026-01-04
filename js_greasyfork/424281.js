// ==UserScript==
// @name         NyaggerTunes CLEAN
// @namespace    NyaggerSquad
// @icon         https://i.imgur.com/sGe5FJ1.png
// @version      1.04
// @description  You'll cowards don't even riichi. Now with Youtube integration, press escape to open menu and input video IDs to replace music. Create playlists by separating with commas. (Remember to unblock youtube, ytimg and googlevideo scripts and allow site autoplay in your browser)
// @author       anon
// @include      https://mahjongsoul.game.yo-star.com/
// @include      https://game.mahjongsoul.com/
// @include      https://majsoul.union-game.com/0/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/424281/NyaggerTunes%20CLEAN.user.js
// @updateURL https://update.greasyfork.org/scripts/424281/NyaggerTunes%20CLEAN.meta.js
// ==/UserScript==

GM_addStyle(`
.fuck{
  background-color:#eee;
  position:fixed;
  z-index:1000;
  background-size: 120px 120px;
  background-position: right bottom;
  background-repeat: no-repeat;
  background-image: url('https://i.imgur.com/sGe5FJ1.png');
  border-radius:5px;
  margin:0px;
  box-shadow: 3px 5px 5px #0005;
}
.tarea{
  background: #fffb;
  display:block;
  margin:5px;
  height:35px;
  width:300px;
  white-space: nowrap;
}
.labelBtn{
  background: #fffb;
  font-size:10pt;
  padding:3px;
  float:left;
  margin:5px;
  margin-left:5px;
  border-width: 2px;
  border-style: solid;
  border-bottom-color: gray;
  border-right-color: gray;
  border-top-color: silver;
  border-left-color: silver;
}

input[type=checkbox]:checked + label{
  background: #6f6b;
  border: 2px solid #3c3;
}
`);

//automate this some time
var map = {
    'music/game.mp3': ['6o3vN8AfkRk','NvJGKyiGPyQ','mLDo-jHcvAQ'],
    'music/lobby.mp3': 'jX6fqafv3_Q',
    'music/liqi1.mp3': 'Uniah8hu7Mk',
    'music/liqi2.mp3': '1jJsYbVBnaE',
};

var playlist = [];
var pindex = 0;
var pshuffle = true;
var ready = false;

var shuffleMap = [];

var YTdiv = document.createElement('div');
YTdiv.id = "ytplayer";
YTdiv.style="visibility:hidden;";
document.body.appendChild(YTdiv);

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
unsafeWindow.onYouTubeIframeAPIReady = function(){
    player = new YT.Player('ytplayer',{
        height: '0',
        width: '0',
        videoId: '6o3vN8AfkRk',
        //host: 'https://www.youtube.com',
        playerVars: {
            origin: 'https://mahjongsoul.game.yo-star.com',
            enablejsapi: '1',
            mute: '1',
        },
        events:{
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event){
    //event.target.playVideo();
}

function onPlayerStateChange(event){
    //YT.PlayerState.PLAYING
    if (event.data == YT.PlayerState.ENDED) {
        if (Array.isArray(playlist)){
            if (++pindex==playlist.length)
                pindex = 0;
            player.loadVideoById(playlist[shuffleMap[pindex]]);
            return;
        }
        player.loadVideoById(playlist);
    }
}

var once = false;
function playerCheck(f){
    if (!player || !player[f]){
        console.log("Youtube player not initialized.");
        if (!once){
            alert("Youtube player not initialized. Check your script blockers.");
            once = true;
        }
        return false;
    }
    return true;
}

function stopVideo(){
    if (playerCheck("stopVideo"))
        player.stopVideo();
}

function setVolume(v){
    if (playerCheck("setVolume"))
        player.setVolume(v);
}

(function() {
    'use strict';
    document.addEventListener('keydown', function(e) {
        e = e || window.event;
        if (e.keyCode == 27 && ready)
            ToggleMenu();
    }, true);

    var Menu = document.createElement('div');
    document.body.appendChild(Menu);

    function GetAudioList(){
        for (let key in cfg.audio.bgm.map_){
            map[cfg.audio.bgm.map_[key].path] = "";
        }
        for (let key in cfg.item_definition.item.map_){
            let row = cfg.item_definition.item.map_[key];
            if (Array.isArray(row.sargs) && row.sargs[0].search("music/") != -1){
                map[row.sargs[0]] = "";
            }
        }
    };

    function CloseMenu(){
        Menu.style.visibility = "hidden";

        for (var m in map){
            var iv = document.getElementById(m).value.replace(/\s/g,"").split(',');
            map[m] = iv.length==1?iv[0]:iv;
        }
        pshuffle = document.getElementById('shuffleBtn').checked;
        localStorage.setItem("tutturu", JSON.stringify({
            tunes: map,
            shuffle: pshuffle
        }));

        localStorage.removeItem("riichiFile"); //old trash
    }

    function ToggleMenu(){
        Menu.style.visibility==""?CloseMenu():Menu.style.visibility="";
    }

    function InitMenu(){
        Menu.className = "fuck";
        Menu.style = 'position:absolute';

        GetAudioList();

        if (localStorage.getItem("tutturu")){
            let local = JSON.parse(localStorage.getItem("tutturu"));
            for (let m in local.tunes)
                map[m] = local.tunes[m];
            pshuffle = local.shuffle;
        }

        for (let m in map){
            let label = document.createElement('label');
            label.style = 'height:10px;color:gray;font-size:12pt;margin:5px;display:block;';
            label.innerHTML = m;
            let input = document.createElement('textarea');
            input.className = "tarea";
            input.id = m;
            input.autocomplete="off";
            input.autocorrect="off";
            input.autocapitalize="off";
            input.spellcheck="false";
            input.value = Array.isArray(map[m])?map[m].join():map[m];

            Menu.appendChild(label);
            Menu.appendChild(input);
        }

        function makeButton(id, string, checked){
            let label = document.createElement('label');
            label.for = id;
            label.className = "labelBtn";
            label.innerHTML = string;
            label.onclick = function(e){
                var input = document.getElementById(this.for);
                input.checked = !input.checked;
            }
            let input = document.createElement('input');
            input.type = "checkbox";
            input.id = id;
            input.style = "display:none;";
            input.checked = checked;

            Menu.appendChild(input);
            Menu.appendChild(label);
        }

        makeButton("shuffleBtn","Shuffle Playlists",pshuffle);

        Menu.init = "FuckJavascript";
        Menu.style.visibility = "hidden";
    }

    document.addEventListener("click", function(event){
        if (event.target.closest(".fuck"))
            return;

        if (Menu.style.visibility == "")
            CloseMenu();
    });

    function shuffleArray(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function setShuffle(toggle){
        if (Array.isArray(playlist)){
            for (var i = 0; i < playlist.length; i++){
                shuffleMap[i] = i;
            }
        } else
            shuffleMap = [0];

        if (toggle)
            shuffleArray(shuffleMap);
    }

    function loadPlaylist(ids, index){ //courtesy of google being fucking worthless
        playlist = ids;
        pindex = index;
        setShuffle(pshuffle);
        if (Array.isArray(playlist)){
            player.loadVideoById(playlist[shuffleMap[index]]);
            return;
        }
        player.loadVideoById(playlist);
    }

    function playSomething(i, d){
        for (var m in map){
            if (m == i){
                var id = map[m];
                if (Array.isArray(map[m]))
                    id = map[m][shuffleMap[pindex]];
                if (id == "" || !playerCheck("getVideoData"))
                    continue;

                if (player.getVideoData()['video_id'] != id || player.getPlayerState() != YT.PlayerState.PLAYING)
                    loadPlaylist(map[m],0);

                player.unMute();
                Laya.SoundManager.stopMusic(0);
                return d;
            }
        }
        stopVideo();
        return Laya.SoundManager.playMusic("audio/" + i, 0);
    }

    var e;
    ! function(t) {
        t[t.none = 0] = "none", t[t.start = 1] = "start", t[t.during = 2] = "during", t[t.end = 3] = "end"
    }(e || (e = {}));

    function onMusicChange(t){
        try{
            void 0 === t && (t = 1e3);
            var i = "",
                n = 0;
            "" == i && !this.lizhiMuted && this._current_lizhi_bgm && (i = this._current_lizhi_bgm, n = this.lizhiVolume),
            "" == i && !this.musicMuted && this._current_music && (i = this._current_music, n = this.musicVolume),
                this._music ? i == this._playing_music ||
                (this._music.stop(), this._music = null, i && (this._music = playSomething(i,this._music),
                                                               this._music &&
                                                               (this._playing_music = i,
                                                                this._playing_music_volume = n,
                                                                this._music.volume = 0,
                                                                this._music_state = e.start,
                                                                this._music_state_starttime = Laya.timer.currTimer,
                                                                this._music_state_lifetime = t)))
            : i && (this._music = playSomething(i,this._music),
                    this._music && (this._playing_music = i,
                                    this._playing_music_volume = n,
                                    this._music.volume = 0,
                                    this._music_state = e.start,
                                    this._music_state_starttime = Laya.timer.currTimer,
                                    this._music_state_lifetime = t))

            //beautiful
            this._playing_music = i;
            this._playing_music_volume = n;
            this._music_state = e.start;
            this._music_state_starttime = Laya.timer.currTimer;
            this._music_state_lifetime = t;
            setVolume(n*100.0);
            player.defaultVol = n*100.0;
        } catch(e){console.log(e); stopVideo(); backup(t);}
    }


    var backup = 0;
    var LobbyCheck = setInterval(function(){
        if (GameMgr.prototype.EnterLobby){
            setShuffle(pshuffle);
            GameMgr.prototype.EnterLobby = (function() {
                var cacheF = GameMgr.prototype.EnterLobby;
                return function() {
                    ready = true;
                    if (!Menu.init) InitMenu();
                    backup = view.AudioMgr.onMusicChange;
                    view.AudioMgr.onMusicChange = onMusicChange;
                    view.AudioMgr.StopMusic = function(t) {
                        void 0 === t && (t = 1e3)
                        this._current_music = "";
                        this._current_lizhi_bgm = "";
                        (t <= 0 ?
                         (playerCheck("stopVideo") && player.stopVideo(), this._music && this._music.stop(), this._music = null, this._music_state = e.none) :
                         (this._music_state = e.end, this._music_state_starttime = Laya.timer.currTimer, this._music_state_lifetime = t)
                        )
                    }

                    Laya.timer._getHandler(view.AudioMgr,view.AudioMgr._update).method = (function(){
                        var c = view.AudioMgr._update;
                        return function() {
                            if (!isNaN(player.getVolume())){
                                var volume = player.defaultVol/100.0;
                                if (this._music_state != e.none) {
                                    var t = Laya.timer.currTimer - this._music_state_starttime;
                                    if (this._music_state == e.start){
                                        if (t >= this._music_state_lifetime) volume = this._playing_music_volume;
                                        else {
                                            i = t / this._music_state_lifetime;
                                            volume = volume * i;
                                        }
                                    } else if (this._music_state == e.end){
                                        if (t >= this._music_state_lifetime) {volume = 0; player.stopVideo();}
                                        else {
                                            var i = t / this._music_state_lifetime;
                                            volume = volume * (1 - i);
                                        }
                                    }
                                }
                                setVolume(volume*100.0);
                            }
                            var res = c.apply(this,arguments);

                            if (this._music_state == e.start && t >= this._music_state_lifetime) this._music_state = e.during;
                            else if (this._music_state == e.end && t >= this._music_state_lifetime) this._music_state = e.none, this._current_music = "";

                            return res;
                        };
                    })();
                    var result = cacheF.apply(this, arguments);
                    return result;
                };
            })();
            clearInterval(LobbyCheck);
        }
    },2000);
})();