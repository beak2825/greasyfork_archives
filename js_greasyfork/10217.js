// ==UserScript==
// @name          K+ upload
// @namespace     https://github.com/krautchan/Kplus
// @description   Makes the post form on KC support more files.
// @include       /^https?://([^.]+\.)?krautchan\.net/.*$/
// @grant         none
// @version       0.1.1
// @downloadURL https://update.greasyfork.org/scripts/10217/K%2B%20upload.user.js
// @updateURL https://update.greasyfork.org/scripts/10217/K%2B%20upload.meta.js
// ==/UserScript==
//
// USAGE:
// Use and distribute this script wisely and sparingly. It's easy to break and
// I'd rather work with DesuChan than against it. If you want to dump a comic -
// go ahead. If you want to dump LS-Models or gore - please go die in a fire.
//
// This script changes the default file input into a multifile input supporting
// an arbitrary number of files. Files are split over posts if there are more
// than the board limit.

/* <boilerplate> */
(function inject(f) {
  var s = document.createElement('script');
  s.src = 'data:application/javascript,' + encodeURIComponent('('+f.toString()+')()');
  document.body.appendChild(s);
  setTimeout(document.body.removeChild.bind(document.body, s), 0);
})(function setUpForm() {
/* </boilerplate> */

  // are we on a board page?
  if (!(window.$ && window.$$ && $('postform'))) {
    return;
  }

  // coopt file input
  var fileinput = $$('#postform input[type=file]')[0].writeAttribute('multiple');

  function partition(arr, by) {
    var arr_ = $A(arr),
        out = [];
    for (var i = 0; i < arr_.length; i += by) {
      out.push(arr_.slice(i, i+by));
    }
    return out;
  }

  function getFiles() {
    return partition(fileinput.files, window.maxFiles);
  }

  $$('head')[0].insert({
    bottom: new Element('style', {type: 'text/css'}).update([
      '.filebox {',
      'margin: 0.5em;',
      'padding: 0.5em;',
      'background: white;',
      '}',
      '.filebox table {',
      'text-style: bold;',
      'border-spacing: 0.5em 0;',
      'background-color: #EEEEEE;',
      '}'
    ].join('\n'))
  });

  // TODO file types, sizes, validation?
  // TODO options: number posts, sage following posts or only bump last post
  // thumbnails?
  window.updateFileFields = function () {
    var container = $('filebox_container') ?
        $('filebox_container').update('') :
        $('files_parent').appendChild(new Element('div').writeAttribute('id', 'filebox_container'));

    getFiles().forEach(function (files, i) {
      var filebox = new Element('div').addClassName('filebox'),
          progressbar = $('postform_progress_bar').clone(true)
            .writeAttribute('id', 'filebox_progress_bar_' + i);
      filebox.insert({
        top: progressbar,
        bottom: [
          files.pluck('name').join(', '),
          '(overall size:',
          Math.ceil(files.pluck('size').reduce(function (a,b) { return a+b; }, 0)/1024),
          'kB)'
        ].join(' ')
      });
      container.insert({bottom: filebox});
    });
  };

  // wrap original onsubmit function
  // TODO abort?
  // TODO Captcha
  $('postform').onsubmit = function (ev) {
    var protoform = $('postform'),
        files = getFiles(),
        i = 0,
        progressBars = [],
        uploadHandlers = {
          progress: onProgress,
          load: onDone
        },
        downloadHandlers = {
          error: onError,
          load: onLoad
        };

    ev.preventDefault();
    window.setupProgressTracking = function () {};
    if (!window.onSubmit()) {
      return false;
    }

    function uploadNext() {
      i++;
      uploadCurrent();
    }

    function uploadCurrent() {
      sendPost({
        proto: protoform,
        files: files[i],
        internal_t: ''
      }, uploadHandlers, downloadHandlers);
    }

    function logError(msg) {
      if (msg === undefined) {
        msg = 'unknown error encountered. please check the error console.';
      }
      $$('.filebox')[i].insert({bottom:
        new Element('div').update(msg)
      });
    }

    function onProgress(ev) {
      if (!progressBars[i]) {
        progressBars[i] = new ProgressBar($('filebox_progress_bar_' + i));
      }
      progressBars[i].setValues(ev.loaded, ev.total);
    }

    function onError(ev) {
      logError();
      console.error(ev);
    }

    function onDone(ev) {
      onProgress({loaded: 1, total: 1});
    }

    // ad hoc answer parsing
    // abandon all hope ye who enter here
    function onLoad(ev) {
      var req = ev.target,
          html = req.response;
      // update postform if posting from board to continue in thread
      if (!window.replyThread && !protoform.parent) {
        protoform = protoform.cloneNode(true);
        protoform.appendChild(html.querySelector('input[name=parent]'));
      }

      if (req.status === 200) {
        if (html.title === "Krautchan") {
          if (html.querySelector('td.message_error')) {
            logError(html.querySelector('table').cloneNode(true));
            if (/Bitte warten|Please wait/.test(html.querySelector('td.message_text').textContent)) {
              progressBars[i].reset();
              logError('retrying in 30 seconds.');
              setTimeout(uploadCurrent, 30000);
            }
          } else if (html.querySelector('td.message_notice')) {
            logError(html.querySelector('table').cloneNode(true));
            uploadNext();
          } else {
            logError();
            console.error('error page but no errors? this is odd. please report the response to the author:');
            console.log(req.responseText);
            $('postform_submit').enable();
          }
        } else if (html.title === "Banned!") {
          logError(
            new Element('a').writeAttribute('href','/banned/'+window.board).update('Banned :_:')
          );
          $('postform_submit').enable();
        } else if (i + 1 < files.length) {
          uploadNext();
        } else {
          // we're done!
          // TM-finalURL is used because Chrome won't update the documentURI after a 302
          window.location.assign(window.replyThread ?
            window.location.href.replace(/#.*$/,'') :
            (req.getResponseHeader('TM-finalURL') || html.documentURI));
        }
      } else {
        logError([req.status, req.statusText].join(' '));
        $('postform_submit').enable();
      }
    }

    sendPost({
      proto: $('postform'),
      files: files[i],
      forward: 'thread'
    }, uploadHandlers, downloadHandlers);
  };

  // this old prototypejs is shit and ponies, so we roll our own xhr
  // what happens when forward=nothing? (can be board or thread)
  function sendPost(post, uploadHandlers, downloadHandlers) {
    var req = new XMLHttpRequest(),
        form = post.proto.cloneNode(true);
    // clone omits textarea contents?
    form.internal_t.value = post.proto.internal_t.value;
    $A(form.querySelectorAll('input,textarea'))
      .forEach(function (el) {
        if (el.match('input[type=file]')) {
          el.remove();
        } else if (el.name && post.hasOwnProperty(el.name)) { // optionally override values
          // el.name !== 'proto' && el.name !== 'files'
          el.value = post[el.name];
        }
      });

    var fd = new FormData(form);
    if (post.files) {
      post.files.forEach(function (file, j) {
        fd.append('file_' + j, file);
      });
    }

    var type;
    for (type in uploadHandlers) {
      req.upload.addEventListener(type, uploadHandlers[type], false);
    }
    for (type in downloadHandlers) {
      req.addEventListener(type, downloadHandlers[type], false);
    }

    req.open('POST', '/post');
    req.responseType = 'document';
    req.send(fd);
  }
/* <boilerplate> */
});
/* </boilerplate> */