// ==UserScript==
// @name         Clip-to-Gist Quote Script (ES5, Lemur Compatible)
// @namespace    http://tampermonkey.net/
// @version      2.3.1
// @description  One-click clipboard quotes → GitHub Gist, with keyword highlighting, versioning & Lemur Browser compatibility
// @author       Your Name
// @include      *://*/*
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api.github.com
// @downloadURL https://update.greasyfork.org/scripts/534796/Clip-to-Gist%20Quote%20Script%20%28ES5%2C%20Lemur%20Compatible%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534796/Clip-to-Gist%20Quote%20Script%20%28ES5%2C%20Lemur%20Compatible%29.meta.js
// ==/UserScript==

(function(){
    'use strict';

    // --- Fallback wrappers ---
    var setValue = (typeof GM_setValue === 'function') ?
        GM_setValue :
        function(k, v){ localStorage.setItem(k, v); };

    var getValue = (typeof GM_getValue === 'function') ?
        function(k, def){ var v = GM_getValue(k); return (v===undefined||v===null)?def:v; } :
        function(k, def){ var v = localStorage.getItem(k); return (v===undefined||v===null)?def:v; };

    var httpRequest = (typeof GM_xmlhttpRequest === 'function') ?
        GM_xmlhttpRequest :
        function(opts){
            var headers = opts.headers || {};
            if(opts.method === 'GET'){
                fetch(opts.url, { headers: headers })
                  .then(function(res){ return res.text().then(function(txt){
                      opts.onload({ status: res.status, responseText: txt });
                  }); });
            } else {
                fetch(opts.url, { method: opts.method, headers: headers, body: opts.data })
                  .then(function(res){ return res.text().then(function(txt){
                      opts.onload({ status: res.status, responseText: txt });
                  }); });
            }
        };

    // --- Version key init ---
    var VERSION_KEY = 'clip2gistVersion';
    if(getValue(VERSION_KEY, null) === null){
        setValue(VERSION_KEY, 1);
    }

    // --- Inject global CSS via <style> ---
    function addGlobalStyle(css){
        var head = document.getElementsByTagName('head')[0];
        if(!head){ return; }
        var style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = css;
        head.appendChild(style);
    }
    addGlobalStyle(
        '#clip2gist-trigger{' +
          'position:fixed!important;bottom:20px!important;right:20px!important;' +
          'width:40px;height:40px;line-height:40px;text-align:center;' +
          'background:#4CAF50;color:#fff;border-radius:50%;cursor:pointer;' +
          'z-index:2147483647!important;font-size:24px;box-shadow:0 2px 6px rgba(0,0,0,0.3);' +
        '}' +
        '.clip2gist-mask{' +
          'position:fixed;top:0;left:0;right:0;bottom:0;' +
          'background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;' +
          'z-index:2147483646;' +
        '}' +
        '.clip2gist-dialog{' +
          'background:#fff;padding:20px;border-radius:8px;' +
          'max-width:90%;max-height:90%;overflow:auto;' +
          'box-shadow:0 2px 10px rgba(0,0,0,0.3);' +
        '}' +
        '.clip2gist-dialog input{' +
          'width:100%;padding:6px;margin:4px 0 12px;box-sizing:border-box;font-size:14px;' +
        '}' +
        '.clip2gist-dialog button{' +
          'margin-left:8px;padding:6px 12px;font-size:14px;cursor:pointer;' +
        '}' +
        '.clip2gist-word{' +
          'display:inline-block;margin:2px;padding:4px 6px;border:1px solid #ccc;' +
          'border-radius:4px;cursor:pointer;user-select:none;' +
        '}' +
        '.clip2gist-word.selected{' +
          'background:#ffeb3b;border-color:#f1c40f;' +
        '}' +
        '#clip2gist-preview{' +
          'margin-top:12px;padding:8px;border:1px solid #ddd;' +
          'min-height:40px;font-family:monospace;' +
        '}'
    );

    // --- Insert floating trigger button ---
    function insertTrigger(){
        if(!document.body){
            return setTimeout(insertTrigger, 100);
        }
        var btn = document.createElement('div');
        btn.id = 'clip2gist-trigger';
        btn.textContent = '📝';
        btn.addEventListener('click', mainFlow, false);
        btn.addEventListener('dblclick', openConfigDialog, false);
        document.body.appendChild(btn);
    }
    insertTrigger();

    // --- Main: read from clipboard and pop editor ---
    function mainFlow(){
        navigator.clipboard && navigator.clipboard.readText
          ? navigator.clipboard.readText().then(function(txt){
              if(!txt.trim()){
                  alert('Clipboard is empty');
              } else {
                  showEditor(txt.trim());
              }
          }, function(){
              alert('Please use HTTPS and allow clipboard access');
          })
          : alert('Clipboard API not supported');
    }

    // --- Show editor dialog ---
    function showEditor(rawText){
        var mask = document.createElement('div');
        mask.className = 'clip2gist-mask';
        var dlg = document.createElement('div');
        dlg.className = 'clip2gist-dialog';

        // word spans
        var wrap = document.createElement('div');
        var words = rawText.split(/\s+/);
        for(var i=0;i<words.length;i++){
            var sp = document.createElement('span');
            sp.className = 'clip2gist-word';
            sp.textContent = words[i];
            sp.onclick = (function(el){
                return function(){
                    el.classList.toggle('selected');
                    updatePreview();
                };
            })(sp);
            wrap.appendChild(sp);
        }
        dlg.appendChild(wrap);

        // preview
        var prev = document.createElement('div');
        prev.id = 'clip2gist-preview';
        dlg.appendChild(prev);

        // buttons
        var row = document.createElement('div');
        ['Cancel','Configure','Confirm'].forEach(function(label){
            var b = document.createElement('button');
            b.textContent = label;
            if(label==='Cancel'){
                b.onclick = function(){ document.body.removeChild(mask); };
            } else if(label==='Configure'){
                b.onclick = openConfigDialog;
            } else {
                b.onclick = confirmUpload;
            }
            row.appendChild(b);
        });
        dlg.appendChild(row);

        mask.appendChild(dlg);
        document.body.appendChild(mask);
        updatePreview();

        // update preview text
        function updatePreview(){
            var spans = wrap.children;
            var parts = [];
            for(var j=0;j<spans.length;){
                if(spans[j].classList.contains('selected')){
                    var grp = [spans[j].textContent], k = j+1;
                    while(k<spans.length && spans[k].classList.contains('selected')){
                        grp.push(spans[k].textContent);
                        k++;
                    }
                    parts.push('{' + grp.join(' ') + '}');
                    j = k;
                } else {
                    parts.push(spans[j].textContent);
                    j++;
                }
            }
            prev.textContent = parts.join(' ');
        }

        // upload to Gist
        function confirmUpload(){
            var gistId = getValue('gistId','');
            var token  = getValue('githubToken','');
            if(!gistId || !token){
                alert('Please configure Gist ID and GitHub Token first');
                return;
            }
            var ver = getValue(VERSION_KEY,1);
            var header = 'Version ' + ver;
            var content = prev.textContent;

            // GET existing
            httpRequest({
                method: 'GET',
                url: 'https://api.github.com/gists/' + gistId,
                headers: { 'Authorization': 'token ' + token },
                onload: function(res1){
                    if(res1.status !== 200){
                        alert('Failed to fetch Gist: ' + res1.status);
                        return;
                    }
                    var data = JSON.parse(res1.responseText);
                    var file = Object.keys(data.files)[0];
                    var oldc = data.files[file].content;
                    var upd = '\n\n----\n' + header + '\n' + content + oldc;

                    // PATCH update
                    httpRequest({
                        method: 'PATCH',
                        url: 'https://api.github.com/gists/' + gistId,
                        headers: {
                            'Authorization': 'token ' + token,
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify({ files: (function(){ var o={}; o[file]={content:upd}; return o; })() }),
                        onload: function(res2){
                            if(res2.status === 200){
                                alert('Upload successful! Version ' + ver);
                                setValue(VERSION_KEY, ver+1);
                                document.body.removeChild(mask);
                            } else {
                                alert('Failed to update Gist: ' + res2.status);
                            }
                        }
                    });
                }
            });
        }
    }

    // --- Configuration dialog ---
    function openConfigDialog(){
        var mask = document.createElement('div');
        mask.className = 'clip2gist-mask';
        var dlg = document.createElement('div');
        dlg.className = 'clip2gist-dialog';

        var label1 = document.createElement('label');
        label1.textContent = 'Gist ID:';
        var input1 = document.createElement('input');
        input1.value = getValue('gistId','');

        var label2 = document.createElement('label');
        label2.textContent = 'GitHub Token:';
        var input2 = document.createElement('input');
        input2.value = getValue('githubToken','');

        dlg.appendChild(label1);
        dlg.appendChild(input1);
        dlg.appendChild(label2);
        dlg.appendChild(input2);

        var save = document.createElement('button');
        save.textContent = 'Save';
        save.onclick = function(){
            setValue('gistId', input1.value.trim());
            setValue('githubToken', input2.value.trim());
            alert('Configuration saved');
            document.body.removeChild(mask);
        };
        var cancel = document.createElement('button');
        cancel.textContent = 'Cancel';
        cancel.onclick = function(){
            document.body.removeChild(mask);
        };

        dlg.appendChild(save);
        dlg.appendChild(cancel);
        mask.appendChild(dlg);
        document.body.appendChild(mask);
    }

})();
