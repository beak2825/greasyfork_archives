// ==UserScript==
// @name              网易云音乐提示下载
// @namespace         https://music.163.com/
// @description       当用户进入网易云音乐单曲页面，提示是否下载非限制性歌曲，确认可以自动下载以id命名的mp3文件。
// @match             *://music.163.com/*
// @version           0.2.0
// @author            部分代码来源于网络
// @connect           126.net
// @connect           163.com
// @license           GPLV2
// @compatible        Chrome
// @compatible        FireFox
// @downloadURL https://update.greasyfork.org/scripts/375689/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E6%8F%90%E7%A4%BA%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/375689/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E6%8F%90%E7%A4%BA%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

/*
 * 网易下载库
 * wyyyy.getMusicUrl(params)
 * @params id of music
 * @return url of music
 *
 */

(function (w) {
  if (!window.music) {
    window.music = {};
  }
  // 创建网易云音乐唯一全局变量
  window.music.wyyy = {};
  var root = window.music.wyyy;
  // 获取音乐所需参数
  var modulus = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7' +
    'b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280' +
    '104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932' +
    '575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b' +
    '3ece0462db0a22b8e7';
  var nonce = '0CoJUm6Qyw8W8jud';
  var pubKey = '010001';
  // 获取音乐信息接口地址
  var songDetailUrl = 'https://music.163.com/weapi/v3/song/detail?csrf_token=';
  // 获取音乐接口地址
  var songPlayerUrl = 'https://music.163.com/weapi/song/enhance/player/url?csrf_token=';
  // 获取音乐歌词接口地址
  var songLyricUrl = 'https://music.163.com/weapi/song/lyric?csrf_token=';
  
  // 获取音乐流程
  // 得到id --> 
  
  // 通过音乐的id可以获得播放地址
  root.getMusic = function(id/*歌曲id号*/) {

    
    var songId = id || location.href.match(/id=([0-9]+)/) [1];
    
    root.getMusicUrl(songId, function(res) {
      console.log(res);
      return;
      var isDownload = confirm("是否下载id:" + res.id + '歌曲');
      if (isDownload) {
        console.log('开始加载[' + res.id + '.mp3]...请稍后,加载完自动下载');
        downloadMusic(res);
      } else {
        console.log('取消下载');
      }
    });
    
  };
  
  // 获取音乐信息
  root.getMusicDetail = function(id, callback) {
    // 封装请求参数
    var data = new FormData();
    data = encrypted_request({'ids': [id], 'br': 128000, 'csrf_token': ''});
    var options = {
      url: songDetailUrl,
      data: data,
      type: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      onload: function(res) {
        var json = JSON.parse(res.target.response);
        if (json.data[0].code == 200) {
          info = json.data[0];
          // 封装音乐信息
          var music = {
            br: info.br,     // 比特率
            id: info.id,     // id
            size: info.size, // 大小
            type: info.type, // 格式
            url: info.url    // 播放地址
          };
          callback && callback(music);
        }
      }
    }
    xhr(options);
  }
  
  // 获取音乐播放地址
  root.getMusicUrl = function(id, callback){
    
    // 封装请求参数
    var data = new FormData();
    data = encrypted_request({'ids': [id], 'br': 128000, 'csrf_token': ''});
    var options = {
      url: songPlayerUrl,
      data: data,
      type: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      onload: function(res) {
        var json = JSON.parse(res.target.response);
        if (json.data[0].code == 200) {
          info = json.data[0];
          // 封装音乐信息
          var music = {
            br: info.br,     // 比特率
            id: info.id,     // id
            size: info.size, // 大小
            type: info.type, // 格式
            url: info.url    // 播放地址
          };
          callback && callback(music);
        }
      }
    }
    xhr(options);
  };
  
  function downloadMusic(music) {
    var options = {
      url: music.url,
      type: 'GET',
      responseType: 'blob',
      onload: function(res) {
        if (this.status === 200) {
          var downloader = document.createElement('a');
          downloader.href = window.URL.createObjectURL(this.response);
          downloader.download = music.id + '.mp3';
          downloader.click();
        }
      }
    }
    xhr(options);
    
  };
  
  function xhr(options) {
    var _xhr = new XMLHttpRequest();
    _xhr.open(options.type, options.url, true);
    if (options.header) {
      for (var key in options.header) {
        _xhr.setRequestHeader(key, options.header[key]);
      }
    }
    if (options.responseType) _xhr.responseType = options.responseType;
    _xhr.onload = options.onload;
    _xhr.send(options.data);
    
  }
  
  // params和encSecKey的编码函数 START
  function encrypted_request(text){
      text = JSON.stringify(text);
      var secKey = createSecretKey(16);
      var encText = aesEncrypt(aesEncrypt(text, nonce), secKey);
      var encSecKey = rsaEncrypt(secKey, pubKey, modulus);
      var data = 'params=' + encodeURIComponent(encText) + '&encSecKey=' + encodeURIComponent(encSecKey);
      return data;
  }

  function createSecretKey(size){
      return (Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2)).substring(0,16);
  }

  function aesEncrypt(text, secKey){
    secKey = CryptoJS.enc.Utf8.parse(secKey);
    text = CryptoJS.enc.Utf8.parse(text);
    var encrypted = CryptoJS.AES.encrypt(text, secKey, {
        iv: CryptoJS.enc.Utf8.parse('0102030405060708'),
        mode: CryptoJS.mode.CBC
    });
    encrypted = encrypted.toString();
    return encrypted;
  }

  function rsaEncrypt(text, pubKey, modulus){
    setMaxDigits(256);
    var keys = new RSAKeyPair(pubKey, "", modulus);
    var encText = encryptedString(keys, text);
    return encText;
  }
  // params和encSecKey的编码函数 -END
  
})(window)

music.wyyy.getMusic();