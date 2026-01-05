// ==UserScript==
// @name        Hacker News - Folding Subtrees
// @namespace   https://github.com/pdkl95/user_scripts
// @description Fold and unfold arbitrary comment subtrees.
// @include     https://news.ycombinator.com/item*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12493/Hacker%20News%20-%20Folding%20Subtrees.user.js
// @updateURL https://update.greasyfork.org/scripts/12493/Hacker%20News%20-%20Folding%20Subtrees.meta.js
// ==/UserScript==

/*
    hacker_news-folding_subtrees.user.js
    A user script to fold Hacker News.comments.
    Copyright (C) 2015 Brent Sanders

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(function () {
  var  icon_padding_px = 6;

  var    post_selector = '.athing';
  var  indent_selector = '.ind';
  var  header_selector = '.default div:nth-child(1)';
  var votebox_selector = 'tr td:nth-child(2)';
  
  var style_r90        = ".rotate90  { transform: rotate(90deg);  }";
  var style_r270       = ".rotate270 { transform: rotate(270deg); }";
  var style_foldunfold = ".foldunfoldbtn { position: relative; top: -1px; }";
  var style_fold       = '.foldbtn { opacity: 0.5; }';
  var style_unfold     = '.unfoldbtn { opacity: 0.7; }';
  var style_ctlbox     = '.foldctlbox { position: absolute; padding-left: ' + icon_padding_px + 'px; }'; 
  var style_list = [style_r90, style_r270, style_foldunfold, style_fold, style_unfold, style_ctlbox];
  
  var extra_style_sheet = document.createElement('style');
  extra_style_sheet.type = 'text/css';
  extra_style_sheet.appendChild(document.createTextNode(style_list.join("\n")));
  
  var head = document.querySelector('head');
  head.appendChild(extra_style_sheet);
  
  var foldified_count = 0;
  
  function hide (el) {
    el.style.display = 'none';
  }

  function show_element (el, mode) {
    if (el) {
      el.style.display = mode;
    }
  }

  function show_block        (el) { show_element(el, 'block'       ); }
  function show_inline       (el) { show_element(el, 'inline'      ); }
  function show_inline_block (el) { show_element(el, 'inline-block'); }

  function set_toggle_button_fold (btn) {
    btn.classList.add('foldbtn');
    btn.classList.add('rotate90');
    btn.classList.remove('unfoldbtn');
    btn.classList.remove('rotate270');
  }
  
  function set_toggle_button_unfold (btn) {
    btn.classList.remove('foldbtn');
    btn.classList.remove('rotate90');
    btn.classList.add('unfoldbtn');
    btn.classList.add('rotate270');
  }

  function make_toggle_button (btn_type, rotation_class) {
    var btn = document.createElement('div');
    btn.classList.add('votearrow');
    btn.classList.add('foldunfoldbtn');
    set_toggle_button_fold(btn);
    show_inline_block(btn);
    return btn;
  }
  
  
  function each_subtree_post (post, func) {
    if (!post.hasOwnProperty('indent_width')) { return; }

    var width = post.indent_width || 0;
    post = post.nextElementSibling;

    while (post && post.hasOwnProperty('indent_width') && (post.indent_width > width)) {
      func(post);
      post = post.nextElementSibling;
    }
  }

  function foldify_post(post_el, idx) {
    var ind_el = post_el.querySelector(indent_selector);
    if (!ind_el) { return; }

    var spacer_img = ind_el.firstChild;
    if (!spacer_img) { return; }
    post_el.indent_width = spacer_img.width;
    
    var  header_el = post_el.querySelector(header_selector);
    var votebox_el = post_el.querySelector(votebox_selector);
    
    var votepad_el = null;
    
    var body_br_el = null;
    var body_comment_el = null;
    var body_pad_el = null;
    
    if (header_el) {
      post_el.header_el = header_el;
      votepad_el = document.createElement('span');
      votepad_el.style.display = 'none';

      body_pad_el = document.createElement('div');
      body_pad_el.classList.add('comment');

      var comhead_el = header_el.querySelector('.comhead');

      if (votebox_el) {
        var icon_width = votebox_el.offsetWidth;
        votepad_el.style.width = icon_width;

        if (comhead_el) {
          var comhead_width = comhead_el.offsetWidth;
          body_pad_el.style.width = '' + (comhead_width + icon_width + icon_padding_px) + 'px';
        }
      }
      
      header_el.insertBefore(votepad_el, header_el.firstChild);

      body_br_el      = header_el.parentElement.children[1];
      body_comment_el = header_el.parentElement.children[2];
      
      header_el.parentElement.appendChild(body_pad_el);
      
    }
    
    var toggle_btn = make_toggle_button();
    
    post_el.fold_self = function () {
      post_el.is_folded = true;

      set_toggle_button_unfold(toggle_btn);
      
      hide(votebox_el);
      show_inline_block(votepad_el);
      hide(body_br_el);
      hide(body_comment_el);
      show_block(body_pad_el);
    };
    
    post_el.unfold_self = function () {
      post_el.is_folded = false;

      set_toggle_button_fold(toggle_btn);
      
      show_block(votebox_el);
      hide(votepad_el);
      show_inline(body_br_el);
      show_block(body_comment_el);
      hide(body_pad_el);
    };
    
    post_el.fold_subtree = function () {
      each_subtree_post(post_el, function (post) { post.fold_self(); });
    };
    
    post_el.unfold_subtree = function () {
      each_subtree_post(post_el, function (post) { post.unfold_self(); });
    };

    post_el.fold = function () {
      post_el.fold_self();
      post_el.fold_subtree();
    };
    
    post_el.unfold = function () {
      post_el.unfold_self();
      post_el.unfold_subtree();
    };
    
    post_el.is_folded = false;
    post_el.toggle_fold = function () {
      if (post_el.is_folded) {
        post_el.unfold();
      } else {
        post_el.fold();
      }
    };

    var toggle_event = function (event) {
      post_el.toggle_fold();
    };
    toggle_btn.addEventListener('click', toggle_event, false);

    var ctl_box = document.createElement('div');
    ctl_box.classList.add('foldctlbox');
    ctl_box.appendChild(toggle_btn);
    show_inline_block(ctl_box);
    
    header_el.appendChild(ctl_box);
    
    foldified_count = foldified_count + 1;
  }
  
  function setup_posts () {
    var posts = document.querySelectorAll(post_selector);
    /*console.log('found ' + posts.length + ' posts');*/
    if (posts) {
      Array.prototype.forEach.call(posts, foldify_post);
    }
  }
  
  setup_posts();
  
  /*console.log("foldified " + foldified_count + ' posts');*/
})();