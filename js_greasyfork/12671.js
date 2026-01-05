// ==UserScript==
// @name       powdertoy.co.uk Confirm Discarding A Long Post
// @namespace  http://boxmein.net/
// @version    1.2.1
// @description  Shows a confirmation before accidentally discarding a long forum post. 
// @match      http://powdertoy.co.uk/Discussions/Thread/View.html*
// @match      http://powdertoy.co.uk/Discussions/Thread/Create.html*
// @match      http://powdertoy.co.uk/Conversations/View.html*
// @match      http://powdertoy.co.uk/Conversations/New.html*
// @match      http://powdertoy.co.uk/Groups/Thread/View.html*
// @match      http://powdertoy.co.uk/Groups/Thread/Create.html*
// @copyright 2015 boxmein / apache2 license
// @downloadURL https://update.greasyfork.org/scripts/12671/powdertoycouk%20Confirm%20Discarding%20A%20Long%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/12671/powdertoycouk%20Confirm%20Discarding%20A%20Long%20Post.meta.js
// ==/UserScript==

// http://wiki.greasespot.net/Content_Script_Injection
function contentEval(source) {
  if ('function' == typeof source) {
    source = '(' + source + ')();';
  }

  var script = document.createElement('script');
  script.setAttribute("type", "application/javascript");
  script.textContent = source;

  document.body.appendChild(script);
  document.body.removeChild(script);
}


contentEval(function() {
  $ = ($||window.$||jQuery||window.jQuery);

  // 
  // Configlumaration
  // 

  // should I show debug logs?
  // Default: false
  const DEBUG = false;

  // do I ignore when you leave the page by submitting the topic?
  // Default: true
  const IGNORE_SUBMIT = true;

  // do I copy the text to the clipboard just to be safe before you leave?
  // Default: false
  const COPY_TO_CLIPBOARD = false;

  // how long does the post have to be in characters to be considered long?
  // Default: 400
  const POST_THRESHOLD = 400;

  // what do I tell the user to confirm if they want to leave?
  // Default: "You sure you wanna leave? Seems you have a really tall post typed up."
  const CONFIRM_MESSAGE = "You sure you wanna leave? Seems you have a really tall post typed up.";

  //
  // Actual Code
  // Configuration variables end here. Only edit if you know what you're doing :D
  //

  // what kinds of edit boxes do we know about?
  const possibleEditBoxes = {
    '/Discussions/Thread/Create.html': ['.EditPlain:first'],
    '/Discussions/Thread/View.html':   ['#AddReplyMessage'],
    '/Conversations/View.html':        ['textarea[name="Conversation_Reply"]:first'],
    '/Groups/Thread/View.html':        ['#AddReplyMessage'],
    '/Groups/Thread/Create.html':      ['textarea[name="Thread_Message']
  };

  // what kinds of post buttons do we know about?
  const possiblePostBtns = {
    '/Discussions/Thread/Create.html': ['.btn[name="Thread_Post"]:first'],
    '/Discussions/Thread/View.html':   ['#AddReplyPost'],
    '/Conversations/View.html':        ['.PostForm .btn[value="Send"]:first'],
    '/Groups/Thread/View.html':        ['#AddReplyPost'],
    '/Groups/Thread/Create.html':      ['.SubmitF input[name="Thread_Post"]:first']
  };

  if (DEBUG) debugger;

  if (DEBUG) console.log('attaching to onbeforeunload to confirm discarding >400-long posts');
  
  var iTotallyActuallyMeanToPost = false;
  var pathname = window.location.pathname;

  // try all the selectors in order until one matches
  function findElement(possible_selectors) {
    for (var i = 0, ps = possible_selectors; i < ps.length; i ++) {
      var $temp = $(ps[i]);
      if ($temp.length !== 0 && $temp[0]) {
        return $temp[0];
      }
    }
  }

  window.onbeforeunload = function() { 

    if (DEBUG) console.log('beforeunload!');

    if (!possibleEditBoxes[pathname]) {
      console.error('we don\'t know if there\'s an edit box we care about on this page!');
      if (DEBUG) console.log  ('(i looked for ' + pathname + ' in possibleEditBoxes, which only has [' + Object.keys(possibleEditBoxes).join(', ') + '])');
      return;
    }

    var editBoxes = possibleEditBoxes[pathname];
    var el = findElement(editBoxes);
    
    if (el === undefined) {
      console.error('did not fid a post edit box!');
      if (DEBUG) console.log  ('(i looked for ' + editBoxes.join(', ') + ')');
    }
    else if (el.value.length > POST_THRESHOLD && 
             !iTotallyActuallyMeanToPost) { 
      
      if (DEBUG) console.log('post too long, gonna check with the user');
      
      if (COPY_TO_CLIPBOARD) {
        if (DEBUG) console.log('copying the text to clipboard...');
        el.select();
        document.execCommand("copy");
      }

      return CONFIRM_MESSAGE; 
    }

  };

  // attaching to post button to disable the onbeforeunload thing happening
  // when you actually mean to post
  if (IGNORE_SUBMIT) {

    if (!possiblePostBtns[pathname]) {
      console.error("we don't really know if there's a post button on this page! :(");
      if (DEBUG) console.log  ('(i looked for ' + pathname + ' in possiblePostBtns, which only has [' + Object.keys(possiblePostBtns).join(', ') + '])');
      return;
    }

    var postBtns = possiblePostBtns[pathname];
    var $postBtn = findElement(postBtns);

    if ($postBtn === undefined) {
      console.error('did not find a post button in this page! :(');
      if (DEBUG) console.log  ('(i looked for ' + postBtns.join(', ') + ')');
      return;
    }

    $($postBtn).click(function() { 
      if (DEBUG) console.log('user clicked the post button! letting them past');
      iTotallyActuallyMeanToPost = true; 
    });

  }
});
