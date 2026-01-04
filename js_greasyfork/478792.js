// ==UserScript==
// @name         Klavis Twitter Encryption
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Encrypt and Decrypt your message on Twitter by Klavis
// @author       Klavis
// @license MIT
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/markdown-it/13.0.2/markdown-it.min.js
// @grant GM_xmlhttpRequest
// @grant GM_registerMenuCommand
// @run-at                document-start
// @downloadURL https://update.greasyfork.org/scripts/478792/Klavis%20Twitter%20Encryption.user.js
// @updateURL https://update.greasyfork.org/scripts/478792/Klavis%20Twitter%20Encryption.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("body").prepend(`
    <style>
      article[data-testid="tweet"] p:first-child {margin:0;}
      article[data-testid="tweet"] h1 {font-size:2rem;margin:5px 0;margin-block-start:0.5em;margin-block-end:0em}
      article[data-testid="tweet"] h2 {margin:5px 0;margin-block-start:0.5em;margin-block-end:0em}
      article[data-testid="tweet"] h3 {margin:5px 0;margin-block-start:0.5em;margin-block-end:0em}
      article[data-testid="tweet"] h4 {margin:5px 0;margin-block-start:0.5em;margin-block-end:0em}
      article[data-testid="tweet"] h5 {margin:5px 0;margin-block-start:0.5em;margin-block-end:0em}
      article[data-testid="tweet"] h6 {margin:5px 0;margin-block-start:0.5em;margin-block-end:0em}
      article pre code{border-radius:10px;background:#EFF3F4;padding:10px;width:90%;display:block;color:black}
    </style>

    `)

    function generateError(obj,toReplace,result_text, message)
    {
        result_text = result_text.replaceAll(toReplace, '<div style="background:red;padding:10px 15px;border-radius:10px;color:white;font-weight:bold">'+message+'</div>');
        obj.html(result_text);
    }

    function addObserverIfHeadNodeAvailable() {

        const target = $("head > title")[0],
              MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver,
              observer = new MutationObserver((mutations) => {
                  var tweetTexts = [];
                  mutations.forEach((mutation) => {
                      var tweetTextContainer = $("div[data-testid='tweetText']", mutation.addedNodes)[0];
                      if(tweetTextContainer !== undefined && !tweetTexts.includes(tweetTextContainer)) {
                          tweetTexts.push(tweetTextContainer);
                      }
                  });

                  tweetTexts.forEach((tweetTextContainer) => {
                      // console.log(tweetTextContainer);
                      // Get Text //
                      var regex = /\[kve k="([^"]+)" s="([^"]+)" m="([^"]+)"\]/gm;
                      $(tweetTextContainer).children('span').each(function () {
                          console.log('span', $(this).text())
                          let matches = [...$(this).text().matchAll(regex)];
                          console.log('text to decrypt', matches);

                          // Get Init Text //
                          let result_text = $(this).text();

                          for (const match of matches) {
                              // Call Service to decrypt //
                              let obj = $(this);
                              const decrypting_id = Math.random();

                              GM.xmlHttpRequest({
                                  method: "POST",
                                  url: 'https://klavis-twitter-encryption-server.vercel.app/api/secret',
                                  data: JSON.stringify({
                                      key_id: match[1],
                                      salt: match[2],
                                  }),
                                  headers:    {
                                      "Content-Type": "application/json"
                                  },
                                  onprogress: function(response)
                                  {

                                      let result_text = obj.text();
                                      result_text = result_text.replaceAll(match[0], '['+decrypting_id+'] Decrypting...');
                                      obj.text(result_text);
                                  },
                                  onload: function(response) {
                                      let result_text = obj.text();
                                      let json = JSON.parse(response.responseText);


                                      if (response.status !== 200)
                                      {
                                          generateError(obj, '['+decrypting_id+'] Decrypting...', result_text, json.error);
                                          return;
                                      }


                                      if (json.secret_key)
                                      {
                                          // Decrypt by Secret key //
                                          let decrypted = '';
                                          let originalText = '';
                                          try
                                          {
                                              decrypted = CryptoJS.AES.decrypt(match[3], json.secret_key,{
                                                  mode: CryptoJS.mode.CTR,
                                                  padding: CryptoJS.pad.NoPadding
                                              });
                                              originalText = decrypted.toString(CryptoJS.enc.Utf8);
                                          }
                                          catch
                                          {
                                              generateError(obj, '['+decrypting_id+'] Decrypting...', result_text, 'Secret key not correct...');
                                              return;
                                          }

                                          result_text = result_text.replaceAll('['+decrypting_id+'] Decrypting...', originalText);
                                          const md = window.markdownit({
                                              linkify:      true,
                                              breaks: true
                                          });
                                          md.configure({
                                              components: {
                                                  core: {
                                                      rules: [
                                                          'block',
                                                          'inline',
                                                          'linkify',
                                                      ]
                                                  },
                                                  block: {
                                                      rules: [
                                                          // 'blockquote',
                                                          // 'code',
                                                          'fence',
                                                          'heading',
                                                          //'hr',
                                                          //'htmlblock',
                                                          //'lheading',
                                                          'list',
                                                          'paragraph',
                                                          // 'table'
                                                      ]
                                                  },
                                                  inline: {
                                                      rules: [
                                                          // 'autolink',
                                                          // 'backticks',
                                                          // 'del',
                                                          'emphasis',
                                                          // 'entity',
                                                          // 'escape',
                                                          // 'footnote_ref',
                                                          // 'htmltag',
                                                          'link',
                                                          //'newline',
                                                           'text'
                                                      ]
                                                  }
                                              }
                                          });

                                          obj.html(md.render(result_text));

                                          // Incase of IPFS //
                                          /*
                                          if (originalText.indexOf('mypinata') !== -1)
                                          {
                                              GM.xmlHttpRequest({
                                                  method: "GET",
                                                  url: json.decrypted_txt,
                                                  onprogress: function(response)
                                                  {
                                                      let result_text = obj.text();
                                                      result_text = result_text.replaceAll('['+decrypting_id+'] Decrypting...', '['+decrypting_id+'] IPFS Loading...');
                                                      obj.text(result_text);
                                                  },
                                                  onload: function(response) {
                                                      let result_text = obj.text();
                                                      result_text = result_text.replaceAll('['+decrypting_id+'] IPFS Loading...', response.responseText);
                                                      //originalText = response.responseText;
                                                      obj.text(result_text);
                                                      // GM_setValue(originalText, response.responseText);

                                                  }
                                              });
                                          }*/

                                      }
                                      else
                                      {
                                          generateError(obj, '['+decrypting_id+'] Decrypting...', result_text, 'Secret key not found');
                                          return;
                                      }
                                  },
                                  onerror: function(response)
                                  {

                                      let result_text = obj.text();
                                      generateError(obj, '['+decrypting_id+'] Decrypting...', result_text, 'Fail to retrive secret key');
                                      return;
                                  },
                              })


                          };

                      });

                  });
              });
        if(!target) {
            return;
        }
        clearInterval(waitForHeadNodeInterval);
        observer.observe($("body")[0], { subtree: true, characterData: true, childList: true });

    }

    let waitForHeadNodeInterval = setInterval(addObserverIfHeadNodeAvailable, 100);

})();