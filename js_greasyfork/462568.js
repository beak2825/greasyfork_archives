// ==UserScript==
// @name         网易云盘音乐批量自动匹配
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  自动读取云盘音乐列表，并自动匹配对应歌曲
// @author       hbc007
// @match        https://music.163.com/*
// @icon         https://s1.music.126.net/style/favicon.ico
// @run-at       document-end
// @license      GPLv3.0
// @grant        none
// @homepageURL  https://github.com/hbc007/NeteaseMatch
// @downloadURL https://update.greasyfork.org/scripts/462568/%E7%BD%91%E6%98%93%E4%BA%91%E7%9B%98%E9%9F%B3%E4%B9%90%E6%89%B9%E9%87%8F%E8%87%AA%E5%8A%A8%E5%8C%B9%E9%85%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/462568/%E7%BD%91%E6%98%93%E4%BA%91%E7%9B%98%E9%9F%B3%E4%B9%90%E6%89%B9%E9%87%8F%E8%87%AA%E5%8A%A8%E5%8C%B9%E9%85%8D.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Your code here...
    let logFrame;
    let startBtn;
    let failedSongs = [];
    let songIdx = 0;

    var levenshteinenator = (function () {
        /**
         * @param String a
         * @param String b
         * @return Array
         */
        function levenshteinenator(a, b) {
            var cost;
            var m = a.length;
            var n = b.length;

            // make sure a.length >= b.length to use O(min(n,m)) space, whatever that is
            if (m < n) {
                var c = a;
                a = b;
                b = c;
                var o = m;
                m = n;
                n = o;
            }

            var r = [];
            r[0] = [];
            for (var c = 0; c < n + 1; ++c) {
                r[0][c] = c;
            }

            for (var i = 1; i < m + 1; ++i) {
                r[i] = [];
                r[i][0] = i;
                for (var j = 1; j < n + 1; ++j) {
                    cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
                    r[i][j] = minimator(r[i - 1][j] + 1, r[i][j - 1] + 1, r[i - 1][j - 1] + cost);
                }
            }

            return r;
        }

        /**
         * Return the smallest of the three numbers passed in
         * @param Number x
         * @param Number y
         * @param Number z
         * @return Number
         */
        function minimator(x, y, z) {
            if (x <= y && x <= z) return x;
            if (y <= x && y <= z) return y;
            return z;
        }

        return levenshteinenator;
    })();

    function seachForSongId(songName, artist, album) {
        return new Promise((resolve, reject) => {
            fetch("http://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s=" + encodeURI(songName + " " + artist + " " + album) + "&type=1&offset=0&total=true&limit=100")
                .then((response) => response.json())
                .then(function (data) {
                    if (data.code === 200 && data.result.songs) resolve(data.result.songs);
                    else reject(data);
                })
                .catch((e) => reject(e));
        });
    }

    function getYunPanList() {
        return new Promise((resolve, reject) => {
            fetch("https://music.163.com/api/v1/cloud/get?limit=1000")
                .then((response) => response.json())
                .then(function (data) {
                    resolve(data.data);
                })
                .catch((e) => reject(e));
        });
    }

    function matchSong(yunpanSongId, matchSongId) {
        console.log("matchSong", yunpanSongId, matchSongId);
        return new Promise((resolve, reject) => {
            fetch("https://music.163.com/api/cloud/user/song/match?uid=" + GAccount.id + "&songId=" + yunpanSongId + "&adjustSongId=" + matchSongId)
                .then((response) => response.json())
                .then(function (data) {
                    resolve(data);
                })
                .catch((e) => reject(e));
        });
    }

    async function main() {
        let yunSongs;
        songIdx = 0;
        failedSongs = [];

        try {
            yunSongs = await getYunPanList();
        } catch (e) {
            log("获取云盘列表失败");
            console.error(e);
            if (e.code === 405) {
                log("API调用次数超限制, 请稍后再试");
                setTimeout(summary,500);
                setTimeout(hideLogFrame, 4000);
                return;
            }
            return;
        }

        let doNextMatch = (timeout = 0) => {
            setTimeout(() => {
                songIdx = songIdx + 1;
                if (songIdx >= yunSongs.length) {
                    log("匹配完成");
                    setTimeout(summary,500);
                    setTimeout(hideLogFrame, 4000);
                    return;
                }
                doMatch();
            }, timeout);
        };

        let doMatch = async () => {
            let song = yunSongs[songIdx];
            if (song.simpleSong && song.simpleSong.al && song.simpleSong.al.id) {
                log("云盘:", song.songId, song.songName, song.artist, " > 已匹配:", song.simpleSong.al.id, song.simpleSong.name, song.simpleSong.ar[0].name, song.simpleSong.al.name);
                doNextMatch();
                return;
            }

            let candicateSongs;
            try {
                candicateSongs = await seachForSongId(song.songName, song.artist, song.album);
            } catch (e) {
                log("搜索歌曲失败:", song.songId, song.songName, song.artist, e.message);
                console.error(e);
                failedSongs.push(song);
                if (e.code === 405) {
                    log("API调用次数超限制, 请稍后再试");
                    setTimeout(summary,500);
                    setTimeout(hideLogFrame, 4000);
                    return;
                }
                doNextMatch(800);
                return;
            }

            let dists = [];
            for (const candicateSong of candicateSongs) {
                let d1 = levenshteinenator(song.songName, candicateSong.name);
                let d2 = levenshteinenator(song.artist, candicateSong.artists.join(" "));
                let d3 = levenshteinenator(song.album, candicateSong.album);
                let candicateArtist = "";
                for (const cs of candicateSong.artists) candicateArtist += cs.name;
                let d4 = candicateArtist.includes(song.artist) ? 0 : 100;
                let d5 = candicateSong.name.includes(song.songName) ? 0 : 100;
                dists.push(d1[d1.length - 1][d1[d1.length - 1].length - 1] + d2[d2.length - 1][d2[d2.length - 1].length - 1] + d3[d3.length - 1][d3[d3.length - 1].length - 1] + d4 + d5);
            }
            let minDist = Math.min(...dists);
            if (candicateSongs.length == 0 || isNaN(minDist) || minDist > 100) {
                log("找不到对应歌曲:", song.songId, song.songName, song.artist);
                failedSongs.push(song);
                doNextMatch(800);
                return;
            }
            let minIndex = dists.indexOf(minDist);
            let selectSong = candicateSongs[minIndex];
            log("找到对应歌曲:", selectSong.id, selectSong.name, selectSong.artists[0].name, selectSong.album.name);
            console.log(song.songId, song.songName, song.artist, " > ", selectSong.id, selectSong.name, selectSong.artists[0].name, selectSong.album.name);

            try {
                let matchResult = await matchSong(song.songId, selectSong.id);
                if (matchResult.code === 200) {
                    log("匹配成功:", song.songId, song.songName, song.artist, " > ", selectSong.id, selectSong.name, selectSong.artists[0].name, selectSong.album.name);
                } else {
                    log("匹配失败:", song.songId, song.songName, song.artist, matchResult.message);
                    failedSongs.push(song);
                    console.log(matchResult);
                }
            } catch (e) {
                log("匹配失败:", song.songId, song.songName, song.artist);
                console.error(e);
                failedSongs.push(song);
                if (e.code === 405) {
                    log("API调用次数超限制, 请稍后再试");
                    setTimeout(summary,500);
                    setTimeout(hideLogFrame, 4000);
                    return;
                }
            }

            doNextMatch(2000);
            return;
        };

        doMatch();
    }

    function getTimeStamp() {
        let date = new Date();
        return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }

    function log(...args) {
        logFrame.innerText = "[" + getTimeStamp() + "] " + args.join(" ") + "\n" + logFrame.innerText;
    }

    function showLogFrame() {
        logFrame.style.display = "block";
        startBtn.style.display = "none";
    }

    function hideLogFrame() {
        logFrame.style.display = "none";
        startBtn.style.display = "block";
    }

    function summary() {
        logFrame.innerText = `匹配成功: [${songIdx+1-failedSongs.length}/${songIdx+1}]\n匹配失败: [${failedSongs.length}/${songIdx+1}]\n`;
        for (let song of failedSongs) {
            logFrame.innerText += `- ${song.songId} ${song.songName} ${song.artist}\n`;
        }
    }

    function init() {
        const container = document.getElementsByClassName("m-top")[0];
        const body = document.querySelector("body");

        logFrame = document.createElement("div");
        logFrame.style = "position:fixed;top:0;left:0;width:500px;height:200px;background-color:#000000;opacity:0.8;color:#ffffff;z-index:9999;display:none;overflow-y:scroll;";

        startBtn = document.createElement("button");
        startBtn.style = `position:fixed;top:0;left:0;width:100px;height:${container.clientHeight}px;background-color:#000000;opacity:0.8;color:#ffffff;z-index:9999;`;
        startBtn.innerText = "开始云盘匹配";
        startBtn.onclick = () => {
            showLogFrame();
            main();
        };

        body.appendChild(startBtn);
        body.appendChild(logFrame);
    }
    window.onload = setTimeout(init(), 200);
})();
