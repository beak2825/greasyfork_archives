// ==UserScript==
// @name         斗鱼视频工具
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  收藏
// @author       hulala
// @match        https://v.douyu.com/show*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://cdn.staticfile.org/moment.js/2.22.2/moment.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397085/%E6%96%97%E9%B1%BC%E8%A7%86%E9%A2%91%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/397085/%E6%96%97%E9%B1%BC%E8%A7%86%E9%A2%91%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.$jq = jQuery.noConflict(true);
    
  function getToken() {
      var token = localStorage.getItem('favorite-token');
      return token;
    }
  
    function setToken(token) {
      localStorage.setItem('favorite-token', $jq.trim(token));
      TOKEN.access_token = getToken();
    }
  
    function installTokenListener() {
      window.addEventListener('message', (message) => {
        var data = message.data || {};
        var from = data.from || '';
        var token = data.token || '';
                
        if(from !== 'gitee') {
            return ;
        }

        if(token) {
          setToken(token);
          handleStatus();
          handleDialogClose();
        }
      });
    }
  
    var path = location.pathname;
    var ID = 'lr8t3swv90iaxhjcnk5d473';
    var TOKEN = {access_token: getToken()}; 
    var List = [];
    var Video = {};
    var AUTH_URL = 'https://gitee.com/api/v5/swagger#/getV5ReposOwnerRepoStargazers';
    var isAccess = true;
  
    var insertId = `${ID}-insert`;
    var removeId = `${ID}-remove`;
    var likeId = `${ID}-like`;
    var tokenId = `${ID}-token`;
    var dialogId = `${ID}-dialog`;
    
    function setList({files}) {
      var lol = files.lol || {};
      var value = lol.content;
      List = JSON.parse(value);
    }
  
    function getList(cb) {
      $jq.getJSON(`https://gitee.com/api/v5/gists/${ID}`, TOKEN).then((data) => {
        isAccess = true;
        setList(data);
        cb && cb();
      }, (err) =>  {
        if(err.status === 401) {
          isAccess = false;
          handleVisible();
        }
      });
    }
    
    function setVideo() {
      var title = $jq('.video-title > h1').text().trim();
      var id = path.substring(path.lastIndexOf('/')+1);
      var url = id;
      var favorite = false;
      
      Video = {
        id,
        title,
        url,
        favorite
      };
    }
  
    function createDialog() {
      var body = $jq('body');
      var dialog = $jq(`<div id="${dialogId}"></div>`);
      
      var mask = $jq(`<div style="position:fixed;top:0px;left:0px;right:0px;bottom:0px;z-index:1000;background:rgba(0, 0, 0, 0.65);"></div>`);
      var wrapper = $jq(`<div style="position:fixed;top:0px;left:0px;right:0px;bottom:0px;z-index:1000;overflow:auto;outline:0;"></div>`);
      var content = $jq(`<div style="position:relative;width: 600px;min-height:600px;border:0;margin:0 auto;top:100px;padding:0px;background:#FFF"></div>`);
      var close = $jq(`<div style="text-align:right;padding: 8px;">
                        <a href="javascript:void(0);" 
                          style="
                            text-decoration: none;
                            font-size: 14px;
                            padding: 12px;
                            line-height: 4px;
                            background: #1890ff;
                            color: #FFF;
                            border-radius: 4px;
                            display: inline-block;"
                          >关闭</a></div>`);
      var auth = $jq(`<iframe src="${AUTH_URL}?_t=${Date.now()}" frameborder="0" width="100%" height="600px"></iframe>`);
      
      
      close.on('click', handleDialogClose);
      
      content.append(auth);
      content.append(close);
      
      wrapper.append(content);
      
      dialog.append(mask);
      dialog.append(wrapper);
      
      body.css('overflow','hidden');
      body.append(dialog);
    }
  
    function handleDialogClose() {
      var body = $jq('body');
      var dialog = $jq(`#${dialogId}`);
      dialog.remove();
      body.css('overflow', 'auto');
    }
  
    function createPanel() {
      var panel = $jq('.video-info');
      var favorite = $jq(`<div style="display: inline-block;"><span class="video-cate" style="border-radius:0px">Favorite</span>&nbsp;</div>`);
      var token = $jq(`<a id="${tokenId}" href="javascript:;" class="video-cate">Token</a>`);
      var insert = $jq(`<a id="${insertId}" href="javascript:;" class="video-cate">收录</a>`);
      var like = $jq(`<a id="${likeId}" href="javascript:;" class="video-cate">喜欢</a>`);
      var remove = $jq(`<a id="${removeId}" href="javascript:;" class="video-cate">取消</a>`);
      
      insert.on('click', handleAdd).hide();
      remove.on('click', handleRemove).hide();
      like.on('click', handleLike).hide();
      token.on('click', handleToken).hide();
      
      favorite.append(token);
      favorite.append(insert);
      favorite.append(like);
      favorite.append(remove);
      panel.append(favorite);
    }
  
    function handleVisible(video) {
      var token = $jq(`#${tokenId}`);
      var insert = $jq(`#${insertId}`);
      var like = $jq(`#${likeId}`);
      var remove = $jq(`#${removeId}`);
      
      if(!isAccess) {
        token.show();
        insert.hide();
        like.hide();
        remove.hide();
        return ;
      } else {
        token.hide();
      }
      
      if(video) {
        insert.hide();
        like.show();
        remove.show();
        like.text(video.favorite ? '喜欢' : '普通');
      } else {
        insert.show();
        like.hide();
        remove.hide();
      }
      
    }
  
    function handleToken() {
      createDialog();
    }
  
    function handleUpdate(list, cb) {
      var url = `https://gitee.com/api/v5/gists/${ID}`;
      var content = Object.assign({
        files: {
          lol: {
            content: JSON.stringify(list)
          }
        }
      }, TOKEN);
      $jq.ajax({
        url,
        data: content,
        method: 'PATCH',
        cache: false,
        success(data) {
          isAccess = true;
          setList(data);
          handleStatus();
          cb && cb();
        },
        error(data) {
          if(data.status === 401) {
            isAccess = false;
          }
        }
      });
    }
  
    function handleAdd() {
      var video = Object.assign({}, Video);
      var data = [].concat(List);
      var index = data.findIndex(item => item.index === video.id);
      if(index >= 0) {
        return ;
      }
      data.unshift(video);
      handleUpdate(data);
    }
  
    function handleRemove() {
      var video = Object.assign({}, Video);
      var data = [].concat(List);
      var result = confirm(`确定要删除《${video.title}》`);
      if(!result) {
        return ;
      }
      data.splice(data.findIndex(item => item.id === video.id), 1);
      handleUpdate(data);
    }
  
    function handleLike() {
      var video = Object.assign({}, Video);
      var data = [].concat(List);
      var item = data.find(item => item.id === video.id);
      
      item.favorite = !item.favorite;
      
      handleUpdate(data);
    }
  
    function handleStatus() {
      var video = Object.assign({}, Video);
      getList(() => {
        var item = List.find(item => item.id === video.id);
        if(item) {
          Video = Object.assign({}, item); 
        }
        handleVisible(item);
      });
    }
    
    installTokenListener();
    setVideo();
    createPanel();
    handleStatus();
})();