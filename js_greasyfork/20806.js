// ==UserScript==
// @name        "К непрочитанному" на JoyReactor
// @description Добавляет кнопку "К непрочитанному" на JoyReactor
// @namespace   http://darkdaskin.tk/
// @icon        http://reactor.cc/favicon.ico
// @include     http://joyreactor.cc/*
// @include     https://joyreactor.cc/*
// @include     http://reactor.cc/*
// @include     https://reactor.cc/*
// @include     http://*.reactor.cc/*
// @include     https://*.reactor.cc/*
// @include     http://joyreactor.com/*
// @include     https://joyreactor.com/*
// @include     http://pornreactor.cc/*
// @include     https://pornreactor.cc/*
// @version     1.1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20806/%22%D0%9A%20%D0%BD%D0%B5%D0%BF%D1%80%D0%BE%D1%87%D0%B8%D1%82%D0%B0%D0%BD%D0%BD%D0%BE%D0%BC%D1%83%22%20%D0%BD%D0%B0%20JoyReactor.user.js
// @updateURL https://update.greasyfork.org/scripts/20806/%22%D0%9A%20%D0%BD%D0%B5%D0%BF%D1%80%D0%BE%D1%87%D0%B8%D1%82%D0%B0%D0%BD%D0%BD%D0%BE%D0%BC%D1%83%22%20%D0%BD%D0%B0%20JoyReactor.meta.js
// ==/UserScript==

if (!document.getElementById('post_list')) return;

var posts = [];
var readPostIds = JSON.parse(localStorage['readPostIds'] || '[]');
var maxReadPostIds = 100000;
var nextUnreadLink;
var bodyHeight;

addControls();  
findPosts();

window.addEventListener('load', function (e) {
  updatePosts();
  skipToUnread(true);
});

window.addEventListener('scroll', function (e) {
  if (bodyHeight !== document.body.clientHeight) {
    bodyHeight = document.body.clientHeight;
    updatePosts();
  }
  
  var activePostElement = document.querySelector('.article.active');
  if (activePostElement && activePostElement.classList.contains('scroll-target')) {
    var activePostRect = activePostElement.getBoundingClientRect();
    if (activePostRect.top > window.innerHeight) {
      console.log('scrollfix', window.scrollY + activePostRect.top)
      window.scrollTo(window.scrollX, window.scrollY + activePostRect.top);
    }
    activePostElement.classList.remove('scroll-target');
  }
  
  var windowTop = window.scrollY;
  var windowBottom = windowTop + window.innerHeight;
  var justSeenPosts = posts.filter(function (post) {
    post.isTopSeen = post.isTopSeen || post.top >= windowTop && post.top < windowBottom;
    post.isBottomSeen = post.isBottomSeen || post.bottom >= windowTop && post.bottom < windowBottom;
    return !post.isRead && post.isTopSeen && post.isBottomSeen;
  });
  markAsRead(justSeenPosts);
});

function addControls() {
  nextUnreadLink = document.createElement('a');  
  nextUnreadLink.href = '#';
  var nextUnreadButton = document.createElement('div');
  nextUnreadButton.id = 'nextUnreadButton';
  nextUnreadButton.appendChild(nextUnreadLink);
  document.body.appendChild(nextUnreadButton);
  
  nextUnreadLink.addEventListener('click', function (e) {
    if (sessionStorage['skipToUnread'] !== 'true') {
      skipToUnread();
    } else {
      delete sessionStorage['skipToUnread'];
    }
    e.preventDefault();
  });
  
  var style = document.createElement('style');
  style.appendChild(document.createTextNode(''));
  document.head.appendChild(style);
  style.sheet.insertRule('\
    #nextUnreadButton {\
      position: fixed;\
      top: 50vh;\
      right: 0;\
      background: #fdda97;\
      color: #282828;\
      font-size: 1.5em;\
      box-shadow: 1px 1px 4px black;\
    }', style.sheet.cssRules.length);
  style.sheet.insertRule('\
    #nextUnreadButton a {\
      display: inline-block;\
      width: 40px;\
      line-height: 40px;\
      text-align: center;\
      text-decoration: none;\
  }', style.sheet.cssRules.length);
  style.sheet.insertRule('\
    #nextUnreadButton a:before {\
    content: "⇣"\
  }', style.sheet.cssRules.length);
  style.sheet.insertRule('\
   #nextUnreadButton .loading {\
    background-image: url("http://css.joyreactor.cc/images/jquery-ui/ui-anim_basic_16x16.gif");\
    background-position: 12px 12px;\
    background-repeat: no-repeat;\
   } ', style.sheet.cssRules.length);
  style.sheet.insertRule('\
   #nextUnreadButton .loading:before {\
    content: "\\00a0"\
   } ', style.sheet.cssRules.length);
  
  updateControls();
  
  window.addEventListener('keydown', function (e) {
    var nodeName = e.target.nodeName.toLowerCase();    
    var isInput = nodeName === 'textarea' || nodeName === 'input' || e.target.classList.contains('redactor_editor');
    if (isInput) return;
    
    if (e.keyCode === 88 /* x */) {
      skipToUnread();
    } else if (e.keyCode === 83 /* s */) {
      var activePosts = posts.filter(function (post) {
       return post.element === document.querySelector('.article.active');       
      });
      if (activePosts.length > 0) {
        var activePostIndex = posts.indexOf(activePosts[0]);
        if (activePostIndex > 0) {
          markAsRead([posts[activePostIndex - 1]]);
        }        
      }
    }
  });
}

function updateControls () {
  if (sessionStorage['skipToUnread'] === 'true') {
    nextUnreadLink.title = 'Поиск непрочитанных постов... Нажми для отмены.';
    nextUnreadLink.classList.add('loading');
  } else {
    nextUnreadLink.title = 'К непрочитанному [X]';
    nextUnreadLink.classList.remove('loading');
  }  
}

function skipToUnread (isAtLoad) {
  if (isAtLoad && sessionStorage['skipToUnread'] !== 'true') return;
  
  var unreadPosts = posts.filter(function (post) {
    return !post.isRead;
  });
  
  var abovePosts = posts.filter(function (post) {
    return post.top < window.scrollY + 1;
  });
  
  if (abovePosts.length > 0) {
    var currentPost = abovePosts.pop();
    markAsRead([currentPost]);
    var index = unreadPosts.indexOf(currentPost);
    if (index >= 0) {
      unreadPosts.splice(index, 1);
    }
  }
  
  if (posts.length > 0 && unreadPosts.length === 0) {
    console.info('All posts on the page are read, skipping...');
    sessionStorage['skipToUnread'] = 'true';
    updateControls();
    window.location.href = document.querySelector('.next').href;
    return;
  } 
  
  delete sessionStorage['skipToUnread'];
  
  if (unreadPosts.length > 0) {
    var targetPost = unreadPosts[0];
    targetPost.element.classList.add('scroll-target');    
    posts.forEach(function (post) {
      if (post === targetPost) {
        post.element.classList.add('active');
      } else {
        post.element.classList.remove('active');
      }
    });
    window.scrollTo(window.scrollX, targetPost.top);
  }
  
  updateControls();
}

function findPosts() {
  posts = posts.map.call(document.querySelectorAll('.article'), function (postElement) {
    var linkElement = postElement.querySelector('.link[href^="/post/"]');
    var id = parseInt(linkElement.href.match(/\d+$/)[0]);
    return {
      element: postElement,
      id: id,
      isRead: readPostIds.indexOf(id) >= 0
    };
  });  
}
  
function updatePosts () {
  posts.forEach(function (post) {
    var rect = post.element.getBoundingClientRect();
    post.top = window.scrollY + rect.top;
    post.bottom = window.scrollY + rect.bottom;
  })
};

function markAsRead(posts) {
  for (var i = 0; i < posts.length; i++) {
    var post = posts[i];
    if (!post.isRead) {
      readPostIds.push(post.id);
      post.isRead = true;
      console.info('Marked post ' + post.id + ' as read.')
    }      
  }
  if (readPostIds.length > maxReadPostIds * 1.1) {
    readPostIds.sort();
    readPostIds = readPostIds.slice(Math.round(maxReadPostIds / 10), maxReadPostIds);
  }
  localStorage['readPostIds'] = JSON.stringify(readPostIds);
}