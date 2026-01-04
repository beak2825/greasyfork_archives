// ==UserScript==
// @name        明日方舟塞壬唱片下载器(Arknights Monster-Siren Music Downloader)
// @name:zh-CN  明日方舟塞壬唱片下载器
// @name:zh_TW  明日方舟塞壬唱片下載器
// @name:en     Arknights Monster-Siren Music Downloader
// @name:ja     アークナイツ　モンスターサイレン　ダウンローダー
// @namespace   monster-siren.hypergryph.com
// @match       https://monster-siren.hypergryph.com/*
// @grant       none
// @version     1.3
// @author      sodawatter
// @description:zh-CN 从塞壬唱片(https://monster-siren.hypergryph.com/)下载无损高质量音乐。本插件可以支持下载单曲、整张专辑或者歌词。请进入想下载的歌曲主界面后点击左上角的按钮进行下载。由于高质量音乐文件较大，可能需要一段时间等待下载完成。
// @description:zh_TW 從塞壬唱片(https://monster-siren.hypergryph.com/)下載無損高品質音樂。本插件可以支持下載單曲、整張專輯或者歌詞。請進入想下載的歌曲主界面後點擊左上角的按鈕進行下載。由於高品質音樂文件較大，可能需要一段時間等待下載完成。
// @description:en Download lossless high quality music from Monster Siren (https://monster-siren.hypergryph.com/). This plugin can support downloading single songs, whole albums or lyrics. Please enter the page of the song you want to download and click the button in the upper left corner to download. Due to the large size of high quality music files, it may take some time to wait for the download to complete.
// @description:ja モンスターサイレン (https://monster-siren.hypergryph.com/) からロスレスで高音質の音楽をダウンロードできます。 このプラグインは、単一の曲と歌詞またはアルバム全体のダウンロードをサポートすることができます。 ダウンロードしたい曲のインターフェイスに入り、左上のボタンをクリックしてダウンロードしてください。 高音質の音楽ファイルはサイズが大きいため、ダウンロードが完了するまでに時間がかかる場合があります。
// @license     MIT
// @description 从塞壬唱片(https://monster-siren.hypergryph.com/)下载音乐，可以下载单曲或整张专辑。
// @downloadURL https://update.greasyfork.org/scripts/484762/%E6%98%8E%E6%97%A5%E6%96%B9%E8%88%9F%E5%A1%9E%E5%A3%AC%E5%94%B1%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8%28Arknights%20Monster-Siren%20Music%20Downloader%29.user.js
// @updateURL https://update.greasyfork.org/scripts/484762/%E6%98%8E%E6%97%A5%E6%96%B9%E8%88%9F%E5%A1%9E%E5%A3%AC%E5%94%B1%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8%28Arknights%20Monster-Siren%20Music%20Downloader%29.meta.js
// ==/UserScript==
(function () {
    'use strict';
    function downloadMusicWithCid(musicId, albumName) {
        console.log("Download " + musicId);
        var apiUrl = 'https://monster-siren.hypergryph.com/api/song/' + musicId;
        // Fetch the JSON data from the API URL
        fetch(apiUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var sourceUrl = data.data.sourceUrl;
                var musicName = data.data.name;

                // Create a new XMLHttpRequest object
                var xhr = new XMLHttpRequest();
                xhr.open('GET', sourceUrl, true);
                xhr.responseType = 'blob'; // Set the response type to blob

                xhr.onload = function () {
                    if (xhr.status === 200) {
                        // Create a new Blob object from the response
                        var blob = new Blob([xhr.response], { type: 'audio/wav' });

                        // Create a temporary URL for the Blob object
                        var url = URL.createObjectURL(blob);

                        // Create a link element and set the href and download attributes
                        var link = document.createElement('a');
                        link.href = url;
                        link.download = '[' + albumName + '] ' + musicName + '.wav';
                        link.click(); // Simulate a click on the link to start the download
                    }
                };

                xhr.send();
            })
            .catch(function (error) {
                console.error('An error occurred while fetching the music data:', error);
            });
    }

    function downloadLyricsWithCid(musicId, albumName) {
        console.log("Download lyrics of " + musicId);
        var apiUrl = 'https://monster-siren.hypergryph.com/api/song/' + musicId;
        // Fetch the JSON data from the API URL
        fetch(apiUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var lyricUrl = data.data.lyricUrl;
                if (lyricUrl) {
                    var musicName = data.data.name;

                    // Create a new XMLHttpRequest object
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', lyricUrl, true);
                    xhr.responseType = 'text'; // Set the response type to text

                    xhr.onload = function () {
                        if (xhr.status === 200) {
                            // Create a new Blob object from the response
                            var blob = new Blob([xhr.response], { type: 'text/plain' });

                            // Create a temporary URL for the Blob object
                            var url = URL.createObjectURL(blob);

                            // Create a link element and set the href and download attributes
                            var link = document.createElement('a');
                            link.href = url;
                            link.download = '[' + albumName + '] ' + musicName + '.lrc';
                            link.click(); // Simulate a click on the link to start the download
                        }
                    };
                    xhr.send();
                }    
                else {
                    console.log('No lyrics available.');
                }
                    
            })
            .catch(function (error) {
                console.error('An error occurred while fetching the lyrics data:', error);
            });
    }

    function getJSON(url) {
        return new Promise(function(resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
              } else {
                reject(new Error('Error while fetching JSON data'));
              }
            }
          };
          xhr.send();
        });
      }

    async function getAlbumId(musicId) {
        var apiUrl = 'https://monster-siren.hypergryph.com/api/song/' + musicId;
        var albumId = '';
        var json_data = await getJSON(apiUrl);
        albumId = json_data.data.albumCid;
        return albumId;
    }

    async function getAlbumName(albumId) {
        var resName = '';
        var json_data = await getJSON('https://monster-siren.hypergryph.com/api/albums');
        for (var i = 0; i < json_data.data.length; i++) {
            if (json_data.data[i].cid == albumId) {
                resName = json_data.data[i].name;
            }
        }
        return resName;
    }

    async function getMusicIdListOfAlbum(albumId) {
        var resList = [];
        var json_data = await getJSON('https://monster-siren.hypergryph.com/api/songs');
        for (var i = 0; i < json_data.data.list.length; i++) {
            if (albumId == json_data.data.list[i].albumCid) {
                resList.push(json_data.data.list[i].cid);
            }
        }
        return resList;
    }

    async function downloadMusic(btn) {
        var currentUrl = window.location.href;
        var musicId = currentUrl.split('/').pop();
        if (!isNaN(musicId) && musicId != '') {
          var albumId = await getAlbumId(musicId);
          var albumName = await getAlbumName(albumId);
          downloadMusicWithCid(musicId, albumName);

          btn.textContent = 'Downloading';
          setTimeout(function() {
              btn.textContent = 'Download This Music';
          }, 5000);
        } else {
          btn.textContent = 'Not a music page';
          setTimeout(function() {
              btn.textContent = 'Download This Music';
          }, 2000);
        }
    }



    async function downloadAlbum(btn) {
        var currentUrl = window.location.href;
        var musicId = currentUrl.split('/').pop();
        if (!isNaN(musicId) && musicId != '') {
          var albumId = await getAlbumId(musicId);
          var albumName = await getAlbumName(albumId);

          var musicList = await getMusicIdListOfAlbum(albumId);

          var delay = 1000; // Delay in milliseconds

          function downloadMusicWithDelay(musicList, albumName, index) {
              if (index >= musicList.length) {
                  return; // Exit the function when all music has been downloaded
              }

              downloadMusicWithCid(musicList[index], albumName);

              setTimeout(function () {
                  downloadMusicWithDelay(musicList, albumName, index + 1); // Call the function recursively with the next index
              }, delay);
          }
          downloadMusicWithDelay(musicList, albumName, 0);

          btn.textContent = 'Downloading';
          setTimeout(function() {
              btn.textContent = 'Download This Album';
          }, 5000 * musicList.length);
        } else {
          btn.textContent = 'Not a music page';
          setTimeout(function() {
              btn.textContent = 'Download This Music';
          }, 2000);
        }
    }

    async function downloadLyrics(btn) {
        var currentUrl = window.location.href;
        var musicId = currentUrl.split('/').pop();
        if (!isNaN(musicId) && musicId != '') {
          var albumId = await getAlbumId(musicId);
          var albumName = await getAlbumName(albumId);
          downloadLyricsWithCid(musicId, albumName);

          btn.textContent = 'Downloading';
          setTimeout(function() {
              btn.textContent = 'Download Lyrics';
          }, 5000);
        } else {
          btn.textContent = 'Not a music page';
          setTimeout(function() {
              btn.textContent = 'Download Lyrics';
          }, 2000);
        }
    }

    function createButton() {

        var downloadMusicButton = document.createElement('button');
        downloadMusicButton.textContent = 'Download This Music';

        downloadMusicButton.style.position = 'fixed';
        downloadMusicButton.style.zIndex = '9999';
        downloadMusicButton.style.top = '10px';
        downloadMusicButton.style.left = '10px';
        downloadMusicButton.style.padding = '10px';
        downloadMusicButton.style.backgroundColor = '#f44336';
        downloadMusicButton.style.color = 'white';
        downloadMusicButton.style.border = 'none';
        downloadMusicButton.style.borderRadius = '5px';
        downloadMusicButton.style.cursor = 'pointer';
        downloadMusicButton.style.fontFamily = 'Arial, sans-serif';
        downloadMusicButton.style.fontSize = '16px';

        var downloadAlbumButton = document.createElement('button');
        downloadAlbumButton.textContent = 'Download This Album';

        downloadAlbumButton.style.position = 'fixed';
        downloadAlbumButton.style.zIndex = '9999';
        downloadAlbumButton.style.top = '50px';
        downloadAlbumButton.style.left = '10px';
        downloadAlbumButton.style.padding = '10px';
        downloadAlbumButton.style.backgroundColor = '#2196f3';
        downloadAlbumButton.style.color = 'white';
        downloadAlbumButton.style.border = 'none';
        downloadAlbumButton.style.borderRadius = '5px';
        downloadAlbumButton.style.cursor = 'pointer';
        downloadAlbumButton.style.fontFamily = 'Arial, sans-serif';
        downloadAlbumButton.style.fontSize = '16px';

        var downloadLyricsButton = document.createElement('button');
        downloadLyricsButton.textContent = 'Download Lyrics';
        
        downloadLyricsButton.style.position = 'fixed';
        downloadLyricsButton.style.zIndex = '9999';
        downloadLyricsButton.style.top = '90px';
        downloadLyricsButton.style.left = '10px';
        downloadLyricsButton.style.padding = '10px';
        downloadLyricsButton.style.backgroundColor = '#c8a123';
        downloadLyricsButton.style.color = 'white';
        downloadLyricsButton.style.border = 'none';
        downloadLyricsButton.style.borderRadius = '5px';
        downloadLyricsButton.style.cursor = 'pointer';
        downloadLyricsButton.style.fontFamily = 'Arial, sans-serif';
        downloadLyricsButton.style.fontSize = '16px';

        // Append the button to the document body
        document.body.appendChild(downloadMusicButton);
        document.body.appendChild(downloadAlbumButton);
        document.body.appendChild(downloadLyricsButton);
        downloadMusicButton.addEventListener('click', function (e) {
            downloadMusic(downloadMusicButton); 
        });
        downloadAlbumButton.addEventListener('click', function (e) {
            downloadAlbum(downloadAlbumButton); 
        });
        downloadLyricsButton.addEventListener('click', function (e) {
            downloadLyrics(downloadLyricsButton); 
        });
    }

    window.addEventListener('load', function () {
        setTimeout(createButton, 1000); // Add a delay to ensure the music file is loaded
    });
})();