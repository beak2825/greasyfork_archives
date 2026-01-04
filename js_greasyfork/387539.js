// ==UserScript==
// @name         Flood helper for scboy.cc
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Add indicator to replied thread, with auto reply feature
// @author       tianyi
// @include      https://www.scboy.cc/*
// @downloadURL https://update.greasyfork.org/scripts/387539/Flood%20helper%20for%20scboycc.user.js
// @updateURL https://update.greasyfork.org/scripts/387539/Flood%20helper%20for%20scboycc.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let $body = $('body');

  if ($('a[href="?user-login.htm"]').length) {
    console.log('login first!');
  }

  if (localStorage.getItem('postsArray') === null) {
    localStorage.setItem('postsArray', '0');
  }
  let idArray = localStorage.getItem('postsArray').split(',');

  $('.subject > a:not(.badge)').each(function(id, elem) {
    let $this = $(elem);
    let postUrl, postId;

    postUrl = elem.href;
    postId = postUrl.slice(postUrl.lastIndexOf('-') + 1, postUrl.lastIndexOf('.'));

    if (idArray.includes(postId)) {
      $this.addClass('displayDot');
    }
  });

  $('.card-body button[type=submit]').click(function() {
    let $btn = $(this);

    if ($btn.parents('.newpost').length || $('.edui-editor').length) {
      let url = window.location.href;
      let postId = null;

      if ((url.match(/-/g) || []).length === 1) {	/* /?thread-xxxxxx.htm format */
        postId = url.slice(url.lastIndexOf('-') + 1, url.lastIndexOf('.'));
      } else if ((url.match(/-/g) || []).length === 2) {
        if (url.includes('?thread-')) {	/* /?thread-xxxxxx-y.htm format */
          postId = url.slice(url.indexOf('-') + 1, url.lastIndexOf('-'));
        } else if (url.includes('?post-create-')) {	/* /?post-create-xxxxxx.htm format */
          postId = url.slice(url.lastIndexOf('-') + 1, url.lastIndexOf('.'));
        }
      }

      if (postId) {
        console.log(`Replied post id = ${postId} manually.`);
        setLocalStorage(postId);
      } else {
        console.log('Error retrieving post id!');
      }
    }
  });

  if ($('.breadcrumb > .breadcrumb-item:nth-child(2) a').attr('href') === '?forum-4.htm') {
    $body.addClass('modForum');
  }

  let customStyle = `
	<style>
	.displayDot {
		position: relative;
	}
	.displayDot:before {
		content: '';
		top: 6px;
		display: table;
		width: 6px;
		height: 6px;
		background: #66CCFF;
		border-radius: 50%;
		position: absolute;
		left: -10px;
	}
	.flood-mode-icon .unreplied {
		background-color: #00cc00;
		padding: 5px 0;
	}
	.flood-controller {
		position: fixed;
		top: 60px;
		right: 60px;
	}
	.flood-controller span {
		display: inline-block;
		width: 15px;
		height: 15px;
		font-size: 15px;
		line-height: 15px;
		text-align: center;
		cursor: pointer;
	}
	.flood-controller span.selected {
		color: #fff;
	}
	.flood-controller .flood-disabled{
		background-color: #595959;
		color: #595959;
	}
	.flood-controller .flood-icon{
		background-color: #00cc00;
		color: #00cc00;
	}
	.flood-controller .unreply-counter,
	.flood-controller .remaining-time {
		line-height: 12px;
		font-size: 12px;
		margin: 0;
	}
	.modForum .card-body button[type=submit] {
		background-color: red;
		border-color: red;
	}
	</style>`;
  $(customStyle).appendTo('head');

  // auto flood
  if (window.location.href.indexOf('?forum-1.htm') === -1 && window.location.href.indexOf('?forum-2.htm') === -1) {
    return;
  }

  let $switch = $('<div class="flood-controller"><span class="flood-disabled selected" title="Manual">✩</span><span class="flood-icon" title="Flood Icons">✩</span></div>').appendTo($body);
  let $counter = $('<div><p class="unreply-counter"></p><p class="remaining-time"></p></div>').appendTo($switch);
  let iconArray = ['[em_2]','[em_6]','[em_30]','[em_67]','[em_100]','[em_105]','[em_106]','[em_108]','[em_109]','[em_127]'];
  let postIdArray = [];
  let unreplyCounter = 0;
  let interval = 0;
  let sound=new AudioContext()

  let postData = {
    doctype: 1,
    return_html: 1,
    quotepid: 0
  };

  $('.subject > a.xs-thread-a').filter(function() {
    let $this =$(this);
    let myId, threadUserId;
    let idStart, idEnd;
    let blacklist = ['1','5','7','30','86','158','296','856','1367','3651','4109','11733','24638','29062','31321'];

    if ($this.siblings('a[href="?forum-10.htm"]').length) {
    	// skip Hearthstone threads
    	return false;
    }

    if ($this.hasClass('displayDot') ||
      $this.siblings('.icon-lock,.icon-top-1,.icon-top-2,.icon-top-3').length ||
      $this.text().indexOf('禁水') !== -1) {
      return false;
    }

    myId = $('.nav-item.username img').attr('src');
    idStart = myId.lastIndexOf('/') + 1;
    idEnd = myId.indexOf('.png');
    myId = myId.slice(idStart, idEnd);
    threadUserId = $this.parents('.media.thread').first().find('div:first-of-type > a > img[uid]').attr('uid');
    if (myId === threadUserId || blacklist.indexOf(threadUserId) !== -1) {
      return false;
    }

    return !$this.parents('.media.thread').first().find('.approve_red_name,.approve_blue_name,.approve_gold_name').length;


  }).each(function(id, elem) {
    let postUrl, postId;

    postUrl = elem.href;
    postId = postUrl.slice(postUrl.lastIndexOf('-') + 1, postUrl.lastIndexOf('.'));
    postIdArray.push(postId);
    unreplyCounter++;
    $(elem).addClass('unreplied unreplied-id-' + postId);
  });

  $switch.on('click', 'span', function() {
    let $this = $(this);

    if (unreplyCounter <= 0 || $this.hasClass('selected')) {
      return;
    }

    $this.addClass('selected');
    $this.siblings('span').removeClass('selected');

    if (interval !== 0) {
      clearInterval(interval);
      console.log('flood engine stopped');
    }

    if ($this.hasClass('flood-disabled')) {
      $body.removeClass('flood-mode-icon');
      $('.flood-controller p').text('');
      return;
    } else if ($this.hasClass('flood-icon')) {
      $body.addClass('flood-mode-icon');
      interval = floodIcon();
    }
  });

  function floodIcon() {
    let time = 1000*90*(1 + Math.random()/2);
    let interval = setInterval(() => {
      let postId = postIdArray.pop();
      let currentIdArray = localStorage.getItem('postsArray').split(',');
      let iconArray_seed = Math.floor(Math.random() * 10);

      if (currentIdArray.includes(postId)) {
        setRepliedState(postId);
        console.log('skip replied postId ' + postId + ', remaining ' + postIdArray.length + ' (' + Math.floor(time * postIdArray.length / 60000) + ' min)');
        reducePostCount(time);
      } else {
        postData.message = iconArray[iconArray_seed] + ' 　';

        $.post('?post-create-' + postId + '-1.htm', postData, function(data) {

          if (data.code && data.code === '0') {
            console.log('replied ' + postId + ', remaining ' + postIdArray.length + ' (' + Math.floor(time * postIdArray.length / 60000) + ' min)');
            setLocalStorage(postId);
          } else if(data.message && (data.message.indexOf('频繁') !== -1)) {
            console.log('temp error postId ' + postId);
            postIdArray.push(postId);
            unreplyCounter++;
          } else {
            setRepliedState(postId);
            console.log('error postId ' + postId);
          }

          reducePostCount(time);
        }, 'json');
      }
    }, time);

    updateStatus(time, unreplyCounter);
    console.log('flood engine started, interval = ' + Math.floor((time / 1000)) + 's, method: icons');
    console.log('unreplied threads: ' + unreplyCounter + ', expect to finish in ' + Math.floor(time * unreplyCounter / 60000) + ' min');
    return interval;
  }

  function setRepliedState(postId) {
    $('.subject > a[href="?thread-' + postId +'.htm"]').addClass('displayDot');
    $('.unreplied-id-' + postId).removeClass('unreplied');
  }

  function setLocalStorage(postId) {
    let idArray;

    idArray = localStorage.getItem('postsArray').split(',');
    idArray.push(postId);
    localStorage.setItem('postsArray', '' + idArray.join(','));
    setRepliedState(postId);

    console.log('added ' + postId + ' to localstorage');
  }

  function updateStatus(time, unreplyCounter) {
    $('.flood-controller .unreply-counter').text(unreplyCounter + ' left');
    $('.flood-controller .remaining-time').text(Math.floor(time * unreplyCounter / 60000) + ' min');
  }

  function reducePostCount(time) {
    unreplyCounter--;
    updateStatus(time, unreplyCounter);

    if (!postIdArray.length) {
      clearInterval(interval);
      beep(10, 500, 200);
      console.log('all done!');
    }
  }

  function beep(vol, freq, duration){
    let v=sound.createOscillator()
    let u=sound.createGain()
    v.connect(u)
    v.frequency.value=freq
    v.type="square"
    u.connect(sound.destination)
    u.gain.value=vol*0.01
    v.start(sound.currentTime)
    v.stop(sound.currentTime+duration*0.001)
  }
})();