// ==UserScript==
// @name         Pandora music replay and download
// @namespace    https://greasyfork.org/users/35010
// @version      1.3.3
// @description  Gives pandora music replay and download function!
// @require https://code.jquery.com/jquery-3.2.1.min.js
// @require https://cdn.jsdelivr.net/npm/vue@2.6.14
// @author       Thesunfei
// @grant        none
// @include      http://*.pandora.com/*
// @include      https://*.pandora.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/31738/Pandora%20music%20replay%20and%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/31738/Pandora%20music%20replay%20and%20download.meta.js
// ==/UserScript==
/*jshint multistr: true */
if (self !== top) return;
$(function () {
    var styleele = $("<style></style>");
    styleele.html(
        `
#audioitems {
position:fixed;
right:100px;
top:10%;
background-color:rgba(0,0,0,.3);
z-index:1000;
width:400px;
box-sizing:border-box;
padding:0 20px 20px 20px;
cursor:move;
opacity:.5;
transition:opacity .5s,box-shadow .5s;
border-radius:3px;
max-height:80%;
overflow-y:auto;
color:white;
box-shadow:1px 1px 2px rgba(0,0,0,.2);
display:flex;
flex-direction:column;
user-select:none;
}
#audiolist {
flex:1;
overflow-y:auto;
position:relative;
}
#audiolist::-webkit-scrollbar {
width:5px;
}
#audiolist::-webkit-scrollbar-track {
background-color:rgba(0,0,0,.3);
}
#audiolist::-webkit-scrollbar-thumb {
background-color:rgba(255,255,255,.3);
}
#audioitems:hover {
opacity:1;
box-shadow:2px 2px 15px rgba(0,0,0,.4);
}
#audioitems audio {
width:100%;
}
.audioalbum {
overflow:hidden;
text-overflow:ellipsis;
white-space:nowrap;
}
.audioartist {
flex:1;
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
}
.audiowrap:not(:last-child) {
margin-bottom:15px;
}
.audiowrap {
display:flex;
}
.audiocloned {
flex:1;
display:none;
}
.audioinfo {
flex: 1;
display: flex;
flex-direction: column;
justify-content: space-between;
padding:0 10px;
font-size:13px;
overflow:hidden;
}
.audiotitle {
font-weight:bold;
overflow:hidden;
white-space:nowrap;
text-overflow:ellipsis;
}
.imgwrap {
width:90px;
height:90px;
position:relative;
}
.audioimg {
width:100%;
height:100%;
object-fit:contain;
}
.audiocontrol {
position:absolute;
width:100%;
height:100%;
left:0;
top:0;
display:none;
background-position:center;
background-size:50px 50px;
background-repeat:no-repeat;
background-color:rgba(0,0,0,.2);
cursor:pointer;
opacity:.6;
transition:all .2s;
}
.audiocontrol:hover {
opacity:1;
}
.audioplay {
background-image:url(data:image/png;base64,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);
}
.audiopause {
background-image:url(data:image/png;base64,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);
}
.audiocontrol.audioload {
background-color:transparent;
justify-content:center;
align-items:center;
}
.loading .audiocontrol.audioload:after {
content:"";
display:block;
width:50px;
height:50px;
border-radius:50%;
box-sizing:border-box;
border-left:4px solid white;
border-right:4px solid rgba(255,255,255,.3);
border-top:4px solid rgba(255,255,255,.3);
border-bottom:4px solid rgba(255,255,255,.3);
animation:rotate .6s linear infinite;
-webkit-animation:rotate .6s linear infinite;
}
@keyframes rotate {
from {transform:rotate(0)}
to {transform:rotate(360deg)}
}
.audiodownload {
background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACIElEQVRoQ+2Z/VHDMAzF9SaAEWCDjlAmoEzAdQJgAmAC6AR0A9gARoAJaDcoE4h7ubiXpk1qywq0d/Y/vWss+f0sxR8KxLGp6ruIjHtcrkTkDsDca1h4OVJVCifAvrYAcL6vU+zz/wAQAG7jujlKiEABaKZXiUCYjZJCsctOq19JoZJCxtQJZiWFjiqFVHUkIicdUeez58iM6DvwLQEsIv1IdAqpKsXdxDrO6McT6wWAzxgfKQB03DX7MWOl9HkE8BBjkAJAh/cxTjP7/IjIKDaNogEoSlV5EbnOFNhnTvHj2PShoySAgSGSxZsABoIwiTcDOEOYxWcBOEFkic8GyITIFu8CYIRwEe8GkAjhJt4VIBLCVbw7wB4Id/EbAKp6ajysrQDMmtvrjh17S3x9sr007OpfAN6CXbUT1+K/RYQQljYHMG1BhNNrl3iWIa3jrQ97AeBWRJ4syhs2WxC7/NUznyO+chvKkwHA66TZC+ElfkgA+mZ+TgHw/rBuqjoRkZeMtNkI6FARCINQ/IeI8FbFPOcVkldOtzY0gJvQLkeHBMBViosIG1eu5rW189khAcwAVAD1e/LamPWrsOa3iwoFwDHJ+cJzGecvU6i5ufE/Rof/sc/62SFFwDQXbYDYL4ymwQYwYvXurNrQgvM/rLzl8ixFZBJKL1tllfpTUe4gQ9nzG/NG3TS5LjSUMqvfAmCdOS+7EgGvmbT6OfoI/AI45RJAJRGMxwAAAABJRU5ErkJggg==);
background-position:center;
background-repeat:no-repeat;
background-size:20px;
display:block;
width:30px;
}
.audiofns {
display:flex;
}
.audiotrack {
flex:1;
position:relative;
cursor:default;
}
.playing .audiopause{
display:block;
}
.paused .audioplay {
display:block;
}
.loading .audioload {
display:flex;
}
.audiotrack {
flex:1;
height:30px;
background-color:rgba(0,0,0,.2);
position:relative;
}
.audioposition {
height:100%;
position:absolute;
width:2px;
background-color:white;
box-shadow:0 0 3px white;
transition:all .2s;
}
.audiops {
height:100%;
position:absolute;
width:1px;
background-color:white;
opacity:.5;
}
#topinfo {
display:flex;
align-items:center;
flex-shrink:0;
padding:5px 0;
}
#playmode {
border:none;
background-color:transparent;
background-position:center;
background-repeat:no-repeat;
background-size:contain;
width:40px;
height:40px;
margin-right:10px;
outline:none;
opacity:.6;
transition:all .2s;
}
#playmode:hover {
opacity:1;
}
#playmode.loop {
background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACzElEQVRoQ+1Z7XHVMBDcrQCogHQAqYBQAaECSAWECoAKCBUQKkioAFIBSQekAkIFxyxz8sh6kuU3T07kmXe/Zel270O6NbFy48r9xx5A6wia2VcAbwGcA3hP8m7qjK4iYGZHAH5EDl8DeDkFojcAjwH8BPAsAXFCUmA2rCsA8s7MciCURorEBojuAFRAqCZUG4PNBuDMvAJwDOAAwPPWBTxzv8M4ElUA7vg7AKcAFN6HNkXhLDgxCcDMxPKFM546/hdAtrAaIVSUnyZ73ZAcRb4IwFuanI9Zv/L+fFnrz7uAcOLUTuOzv5HU/TCyLIDMBmL7mKRa3KJmZqoxERdb1nktKAH4FRXpjTv/e1HPfXMz+zOH+WINmJmK9bMvEPNHpUtkCUBmproKF1mR+SkAMQO6AUd9dwmn4z296ynXr+ek7CiFkvy7JalO0LWlAMT2G/d41G97RZECUJd54c7q7bF419mVmBTAkP8kq7f0roe3+D4FYEN17wG04Le+x2oi4B1Sr+HvJC+z94CZdZtC0Q19R/LJGgFkyU1TSKFRmKpXeD07264oZccqWqWo2ANomxDb77bqCPiApRlFdkVSAth/W0UNJDOK7gFNbasCoPk4sD6aUWZFwAd8TUlqr5Ni6/bZPf1FopdqQjyIfagCiNRinaQp6bC1k6X9fDoT+0FK+UTyY7y+pgsFqTt8c29TmjsvdSKkzgb7xSL2j+X8UCyO4HX8kFoqEmamUVbOB+aL4sJGBDJhk5/3ok6YWdBeYwFLZ5+WxIX0LSQlLM65QLI0oSV1ITGeExBuXZMqSpgpABXIh6VSY4t9xboE3LNa15uSVbY4r8lSKYBiWkLCbO01VwPKPxVwbOckT5q42XiTkjYqEArho+i8LkFMyetqYQpn1yBqF5lAaEobfjT0phfNeUqotQqEFLsvJKVed2NVAN14WnBkD+ChI/QPgyYlQIajvcoAAAAASUVORK5CYII=);
background-size:30px;
}
#playmode.repeat {
background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADE0lEQVRoQ+1Z7XHVMBDcqwCogHQQUgGhAkIFJBUQKgAqIKmAUEFCBSQVkHRAKiBUcMwyJ89ZT7Jkx3bsGeu3n7S79yHdPsHKl6wcPzYCY0dQVb8BOAZwAeCjiDx0nbGoCKjqIYCfDvAtgDddJJZG4DmAawD7EYkTESGZnbUoAkSnqikSTCNGYofE4ggUSLAmWBvNqiZgyrwFcARgD8CrsQu4cr8DH4kiAQP+AcApAIb3qRejcBZAdBJQVap8aYrHwP8CSBbWSAwZ5ZfRXnci0op8loC1NIL3qt9Yf74q9efHkDDh2E792d9FhPdDayUJJDag2kciwhY36VJV1hiF8ysJnh/kCPxyRXpn4H9Pitw2V9U/Ncpna0BVWaxf7QMqf5i7RKYgpKqsq3CRZZXvIuAV4A3Y6rtTgPZ7Wtdjrt/WpGwrhaL8uxcRdoJBy7Vf/v6mBsyQg2ICVPu9bdTqt302tw7GV2UQ4IuIfO6zR+23MQF2mdf2Y749encdVSXQTxGA2Qg0+S8ixVs6VklVmbtUnuscAG9wrtkIaFPdwwjw4mEXORWRK1UN+62DQCIiG4EginVIvoZ/MLrJe8CFHENqYMoIuBv6QURerJFAsj7jNsrQMEzFK7ymT49ZxLns6N0qa4C7vB2tiDcCfZTfIhCpZQMWZ5TwMKQB9n+togaiGYX3AKe2WQiEF+j1kIehS0XOx0H11oxSFQF7HnNKYnvtNFuH1ErXbyK/lBPinsdQJODcYp7DKelgbJC5/WwoovrBStl5FJZ8oWB1hzMeNaX1IW7g6U6E1NlRP1vE9mOCb4rFDn/nH1J9APX5VlU5yRF8UD5rLuxEIBE2nj2LO6GqwXv1BhbP5nyRNBfitxAHEp9zQTh6QlP6QlQ8ZSDcmyeVtTBjAql5tk/0x/qWqtPAPSt1vS5bZSwwtfvQAaTSNBKqvddUDfjBPBx+ISIntUjm/C7njZIEQ/jMgVkkiS57nS2M4Vw0idJFRhKc0po/GsaYlcdMsZqnBFsrSdCxOxcRuteLWUUCi0GaAbIReOoI/QNAeHtArFvxvAAAAABJRU5ErkJggg==);
background-size:30px;
}
#playmode.shuffle {
background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADgUlEQVRoQ+2Zi23UQBBAZyoAKoAOCBUQKoBUQFIBoQKSCggVkFRAUgFQAZcO0gGhgkHvGJ/G67W93vMRn5SVokh36/W8+e7Mqez50j2XXx4BHtqCi7SAmb0TkZci8kVV74eUtDgAMzsUke8u9EpE3gxBLBEA7X8LWgfiSFXvcpZYHABCmtmpiHwOAuNGWAKY1lokgEMci8jXMYgWgJnx0Ht/CGqIV6p687+yjZm98AA+EBEs8TSB+Kiql81nKcDv5IFmHzA8dD6WFWpBzQzF4f/8Da17VX3WB4DGSV99C5BTVb2qFTR9zrMO/o7GS9atqm72dmLAD2QDpuP/28ypl6p6UvK2oT1m9klEzjJ7cFmyDlaJLvRHRA5jMI8GsZlxALHBi56El43m6BHhCVDOjevcXRVLUwuiVW5xrzSdjgI0p3twXSQWqYIws1T4lnBmhvAUtGbxPZrvVOVigABCMDeZio8nQWSEJ56Iq7VwZobWf5UIz57JAP6SFOJaVY/GYiInvKq23MhdFqU8F5FezTfvqgLogRgM7IzwP1U1usmG3yEOVPXHmFKqARziOomJLESPz2d9ekzg9PttAchQaCnWjhaEV/d4JRh1iykQWwG4FQYhkovZrMJXB3GqIffZ1BJcO9ZFyiEAvZj7KrK1BUJ6zVniJF68prhG6d7ZAAbcaacQswI8BMTsAKGaEhPx7rQTS8wCEK7EXAdoOFZ+JUghaAtHi1Op/8+ShVxQLl/NtfdGVddNSQait7edInTcu5UFMsJzNhMEKvR67RqiGqBH+Kyf7xKiCmCK8DWW8MLI9YT2cd7JXI3wASIdWiHcq9hlufBNNzbaa0yygGcbpmaxTyXr0KkVrczlriVkpqEZhCgGMLMP3GUSKa/ShqSEIgNBA0/8rFOsmRV3fYMAbs7XLjgDp7iYHDN4qloZCM5BcM6ljhRBpIMtOiQEbjqlXMfEaOM4psoqgn+app3EqrFicxwWwRrETHTXjjuVTuYaGWnAz/omxTUgPu1A2yiuZLUsvwFwd4E81QYapzDNKngqqScIXDI3SIvbW710zoUat8Fcd7mRdomaave4IpGB8UrzS008rlUsi7NQrUC1z3l8MDONMdCp9IsE6MlQ2WvK4gAyhWww6y0RIF43OtPo1CUXB+CVmGxEEDPF6PwuFiEWCTAl8B8BpmhrF3v33gJ/ARQ6qUBrzes6AAAAAElFTkSuQmCC);
background-size:30px;
}
#playingtitle {
margin:0;
flex:1;
overflow:hidden;
text-overflow:ellipsis;
white-space:nowrap;
font-size:15px;
padding:0;
cursor:pointer;
}
#playingtitle:hover {
text-decoration:underline;
}
`
    );
    var audioitems = $(
        `
    <div id='audioitems' :style="{left:this.mpos.left+'px',top:this.mpos.top+'px'}" @mousedown="mDown">
        <div id="topinfo">
            <button id="playmode" :class="playmode" @click="playModeSwitch"></button>
            <h3 id="playingtitle" @click="showPlayingItem">{{currentaudioobj.title?"Now Playing : "+currentaudioobj.title:""}}</h3>
        </div>
        <div id="audiolist">
            <div :class="['audiowrap',i.status]" v-for="i in audioobjs">
                <div class='imgwrap'>
                    <img class='audioimg' :src='i.image'>
                    <div class="audiocontrol audioplay" @click="currentaudioobj.domobj&&currentaudioobj.domobj.pause();i.domobj.play()"></div>
                    <div class="audiocontrol audiopause" @click="i.domobj.pause()"></div>
                    <div class="audiocontrol audioload"></div>
                </div>
                <div class='audioinfo'>
                    <div class='audiotitle' :title="i.title">{{i.title}}</div>
                    <div class='audioalbum' :title="i.album">{{i.album}}</div>
                    <div class='audioartist' :title="i.artist">{{i.artist}}</div>
                    <div class="audiofns" v-if="i.src">
                        <div class="audiotrack" @click="i.domobj.currentTime=$event.offsetX/$event.target.clientWidth*i.totaltime">
                            <div class="audioposition" :style="{left:i.currenttime/i.totaltime*100+'%'}"></div>
                        </div>
                        <a class="audiodownload" :href="i.src" :download="getFormatedSongFilename(i)"></a>
                    </div>
                </div>
                <audio preload class='audiocloned' :src="i.src" v-if="i.src" v-bindele="i" @loadedmetadata="i.totaltime=$event.srcElement.duration;i.status='paused'"
                    @timeupdate="i.currenttime=$event.target.currentTime" @play="pausePandora();i.status='playing';currentaudioobj=i;"
                    @pause="currentaudioobj={};i.status='paused'" @ended="i.status='paused';playNext(i)"></audio>
            </div>
        </div>
    </div>
`
    );
    $("body").append(styleele).append(audioitems);
    Vue.directive("bindele",{
        bind:function(el,binding){
            binding.value.domobj=el;
        }
    });
    window.vm = new Vue({
        el: "#audioitems",
        data: {
            playmode: "loop",
            mpos: {
                start: {
                    x: 0,
                    y: 0
                },
                offset: {
                    x: 0,
                    y: 0
                },
                last: {
                    x: 0,
                    y: 0
                },
                movable: false,
                left:parseFloat(getComputedStyle($("#audioitems")[0]).left.replace("px","")),
                top:parseFloat(getComputedStyle($("#audioitems")[0]).top.replace("px",""))
            },
            audiourls: [],
            audioobjs: [],
            currentaudioobj: {},
            pandora:window.Pandora
        },
        methods: {
            mDown:function(e){
                this.mpos.start.x = e.clientX;
                this.mpos.start.y = e.clientY;
                this.mpos.last.x = e.clientX;
                this.mpos.last.y = e.clientY;
                this.mpos.movable = true;
            },
            mMove:function(e){
                if (!this.mpos.movable) return;
                this.mpos.offset.x = e.clientX - this.mpos.last.x;
                this.mpos.offset.y = e.clientY - this.mpos.last.y;
                this.mpos.left+=this.mpos.offset.x;
                this.mpos.top+=this.mpos.offset.y;
                this.mpos.last.x = e.clientX;
                this.mpos.last.y = e.clientY;
            },
            mUp:function(){
                this.mpos.movable = false;
            },
            getAlbum: function () {
                //Pull the album information
                var album = $("[data-qa='playing_album_name']");
                //Make sure only the current album is passed on.
                //  Only take the first in the array to avoid extras that can come in because of timing issues
                //    The additional one is from the previous song
                if (album.length > 1) {
                    album = album.first().text();
                } else if (album.length == 1) {
                    album = album.text();
                } else {
                    album = "";
                }
                return album;
            },
            getAudioURL: function () {
                var audios = document.querySelectorAll("body>audio"),
                    that = this;
                $.each(audios, function (index, item) {
                    if (that.audiourls.indexOf(item.src) == -1) {
                        that.audiourls.push(item.src);
                    }
                });
            },
            getAudio: function (audioobj) {
                var that=this;
                var xhr = new XMLHttpRequest();
                xhr.open("get", audioobj.httpsrc);
                xhr.responseType = "blob";
                xhr.onreadystatechange = function () {
                    if (this.status == 200 && this.readyState == 4) {
                        audio = this.response;
                        //Get the url of the audio object
                        audiourl = URL.createObjectURL(audio);
                        //Set the audio element with the url to get it
                        audioobj.src = audiourl;
                    } else if (this.status != 200) {
                        that.audioobjs.splice(that.audioobjs.indexOf(audioobj),1);
                    }
                };
                xhr.send();
            },
            pausePandora:function(){
                window.Pandora?Pandora.pauseTrack():null;
            },
            playNext: function (last) {
                switch (this.playmode) {
                    case "repeat":
                        last.domobj.play();
                        break;
                    case "shuffle":
                        this.audioobjs.filter(function(v){return v!=last})[Math.round(Math.random() * (this.audioobjs.length - 2))].domobj.play();
                        break;
                    case "loop":
                        this.audioobjs.indexOf(last) == this.audioobjs.length - 1 ? (this.audioobjs[0].domobj.play()) : (this.audioobjs[this.audioobjs.indexOf(last) + 1].domobj.play());
                        break;
                }
            },
            getFormatedSongFilename: function (obj) {
                //What separates artist, album, and track in the filename
                var downloadElementSeparator = " - ";
                //Include a spot for an album, if missing, in the download filename.
                var includeAlbumPlaceholder = true;
                var filename = this.sanitizeString(downloadElementSeparator, obj.artist) +
                    downloadElementSeparator; //Add the artist
                if (obj.album) { //See if we have an album to add
                    filename = filename + this.sanitizeString(downloadElementSeparator, obj.album) +
                        downloadElementSeparator; //  Album object exists so add it
                } else if (includeAlbumPlaceholder == true) { //  Album object does not exist, see if we need to add an album placeholder
                    filename = filename + downloadElementSeparator; //    Add album placeholder by just adding another separator
                }
                filename = filename + this.sanitizeString(downloadElementSeparator, obj.title) +
                    ".m4a"; //Add title and extension
                return filename;
            },
            sanitizeString: function (downloadElementSeparator, dirtyString) {
                //Remove any illegal characters based on the operating system.
                dirtyString = dirtyString.replace(/[*?"|]/g, ""); //windows filename restrictions -> replace with space        * ? |
                dirtyString = dirtyString.replace(/["]/g, "''"); //windows filename restrictions -> replace with ''           "
                dirtyString = dirtyString.replace(/[<>]/g, "_"); //windows filename restrictions -> replace with underscore   < >
                dirtyString = dirtyString.replace(/[\\\/]/g, ","); //windows filename restrictions -> replace with comma        \ /
                dirtyString = dirtyString.replace(/[:]/g, ";"); //windows filename restrictions -> replace with semicolon    :
                var sepRegEx = new RegExp(downloadElementSeparator, "g"); //create RegExp object to find downloadElementSeparator
                dirtyString = dirtyString.replace(sepRegEx, "-"); //downloadElementSeparator      -> replace with dash         -
                return dirtyString;
            },
            playModeSwitch: function () {
                switch (this.playmode) {
                    case "loop":
                        this.playmode = "repeat";
                        break;
                    case "repeat":
                        this.playmode = "shuffle";
                        break;
                    case "shuffle":
                        this.playmode = "loop";
                }
            },
            showPlayingItem:function(){
                $("#audiolist").animate({scrollTop:this.currentaudioobj.domobj.parentElement.offsetTop},500);
            }
        },
        watch: {
            audiourls: function () {
                var httpsrc = this.audiourls[this.audiourls.length - 1],
                    that = this,
                    audioobj = {
                        domobj: null,
                        title: $("[data-qa='mini_track_title']").text(),
                        album: that.getAlbum(),
                        artist: $("[data-qa='mini_track_artist_name']").text(),
                        image: $("[data-qa='mini_track_image']").prop("src"),
                        httpsrc: httpsrc,
                        src: "",
                        currenttime: 0,
                        totaltime: 0,
                        status: "loading"
                    };
                if (audioobj.title=="Advertisement") return;
                this.audioobjs.push(audioobj);
                this.getAudio(audioobj);
            }
        },
        mounted: function () {
            setInterval(this.getAudioURL, 1000);
            $("body").on("mousemove",function(e){
                this.mMove(e);
            }.bind(this));
            $("body").on("mouseup",function(e){
                this.mUp(e);
            }.bind(this));
        }
    });
});