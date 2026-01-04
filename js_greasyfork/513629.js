// ==UserScript==
// @name           Web Translate
// @description    웹페이지에 구글 웹 번역 기능 추가
// @namespace https://greasyfork.org/users/976225
// @match http://*/*
// @match https://*/*
// @version 0.0.1.20241023065207
// @downloadURL https://update.greasyfork.org/scripts/513629/Web%20Translate.user.js
// @updateURL https://update.greasyfork.org/scripts/513629/Web%20Translate.meta.js
// ==/UserScript==
 
(function() {

function AddStyle() {
  let style = document.createElement('style');
  style.textContent = `
  body {
    top: 0px !important;
  }
  .skiptranslate {
    display: none !important;
    height: 0px !important;
  }
  .translation-links{
    /*background-color: #f5f5f5;*/
    transform: translate(-100%, 0%);
    left: 100%;
    padding-top: 5px;
    margin-left: 0px !important;
    list-style: none;
    z-index: 100000;
    position: absolute;
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .translation-links li{
    height: 30px;
    /*padding: 5px;*/
    box-sizing: border-box;
    float: left;
  }
  .translation-links span{
    float: left;
    color: #000;
    border: 1px black;
    border-style: double;
  }
  .translation-links .lang-flag{
    display: inline-block;
    width: 30px;
    height: 20px;
    margin-right: 5px;
  }
  .lang-flag {
    width: 100%;
    height: 66.666666666667%;
    background-size: 100% 100% !important;
  }
  /* south_korea */
  .lang-ko {
    background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNjAwIiB2aWV3Qm94PSItMzYgLTI0IDcyIDQ4IiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+DQo8cGF0aCBmaWxsPSIjZmZmIiBkPSJtLTM2LTI0aDcydjQ4aC03MnoiLz4NCjxnIHRyYW5zZm9ybT0ibWF0cml4KC41NTQ3IC0uODMyMDUgLjgzMjA1IC41NTQ3IDAgMCkiPg0KPGcgaWQ9ImIyIj4NCjxwYXRoIHN0cm9rZT0iIzAwMCIgaWQ9ImIiIHN0cm9rZS13aWR0aD0iMiIgZD0iTS02LTI1SDZNLTYtMjJINk0tNi0xOUg2Ii8+DQo8dXNlIHk9IjQ0IiB4bGluazpocmVmPSIjYiIvPg0KPC9nPg0KPHBhdGggc3Ryb2tlPSIjZmZmIiBkPSJtMCwxN3YxMCIvPg0KPGNpcmNsZSBmaWxsPSIjYzYwYzMwIiByPSIxMiIvPg0KPHBhdGggZmlsbD0iIzAwMzQ3OCIgZD0iTTAtMTJBNiw2IDAgMCAwIDAsMEE2LDYgMCAwIDEgMCwxMkExMiwxMiAwIDAsMSAwLTEyWiIvPg0KPC9nPg0KPGcgdHJhbnNmb3JtPSJtYXRyaXgoLS41NTQ3IC0uODMyMDUgLjgzMjA1IC0uNTU0NyAwIDApIj4NCjx1c2UgeGxpbms6aHJlZj0iI2IyIi8+DQo8cGF0aCBzdHJva2U9IiNmZmYiIGQ9Im0wLTIzLjV2M20wLDM3LjV2My41bTAsM3YzIi8+DQo8L2c+DQo8L3N2Zz4NCg==');

  }
  /* japan */
  .lang-ja {
    background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5MDAgNjAwIj4NCjxwYXRoIGZpbGw9IiNmZmYiIGQ9Im0wLDBoOTAwdjYwMGgtOTAweiIvPg0KPGNpcmNsZSBmaWxsPSIjYmUwMDI2IiBjeD0iNDUwIiBjeT0iMzAwIiByPSIxODAiLz4NCjwvc3ZnPg0K');
  }
  /* united_states */
  .lang-en {
    background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjM1IDY1MCIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPg0KPGRlZnM+DQo8ZyBpZD0idW5pb24iPg0KPHVzZSB5PSItLjIxNiIgeGxpbms6aHJlZj0iI3g0Ii8+DQo8dXNlIHhsaW5rOmhyZWY9IiN4NCIvPg0KPHVzZSB5PSIuMjE2IiB4bGluazpocmVmPSIjczYiLz4NCjwvZz4NCjxnIGlkPSJ4NCI+DQo8dXNlIHhsaW5rOmhyZWY9IiNzNiIvPg0KPHVzZSB5PSIuMDU0IiB4bGluazpocmVmPSIjczUiLz4NCjx1c2UgeT0iLjEwOCIgeGxpbms6aHJlZj0iI3M2Ii8+DQo8dXNlIHk9Ii4xNjIiIHhsaW5rOmhyZWY9IiNzNSIvPg0KPC9nPg0KPGcgaWQ9InM1Ij4NCjx1c2UgeD0iLS4yNTIiIHhsaW5rOmhyZWY9IiNzdGFyIi8+DQo8dXNlIHg9Ii0uMTI2IiB4bGluazpocmVmPSIjc3RhciIvPg0KPHVzZSB4bGluazpocmVmPSIjc3RhciIvPg0KPHVzZSB4PSIuMTI2IiB4bGluazpocmVmPSIjc3RhciIvPg0KPHVzZSB4PSIuMjUyIiB4bGluazpocmVmPSIjc3RhciIvPg0KPC9nPg0KPGcgaWQ9InM2Ij4NCjx1c2UgeD0iLS4wNjMiIHhsaW5rOmhyZWY9IiNzNSIvPg0KPHVzZSB4PSIuMzE1IiB4bGluazpocmVmPSIjc3RhciIvPg0KPC9nPg0KPGcgaWQ9InN0YXIiPg0KPHVzZSB4bGluazpocmVmPSIjcHQiIHRyYW5zZm9ybT0ibWF0cml4KC0uODA5MDIgLS41ODc3OSAuNTg3NzkgLS44MDkwMiAwIDApIi8+DQo8dXNlIHhsaW5rOmhyZWY9IiNwdCIgdHJhbnNmb3JtPSJtYXRyaXgoLjMwOTAyIC0uOTUxMDYgLjk1MTA2IC4zMDkwMiAwIDApIi8+DQo8dXNlIHhsaW5rOmhyZWY9IiNwdCIvPg0KPHVzZSB4bGluazpocmVmPSIjcHQiIHRyYW5zZm9ybT0icm90YXRlKDcyKSIvPg0KPHVzZSB4bGluazpocmVmPSIjcHQiIHRyYW5zZm9ybT0icm90YXRlKDE0NCkiLz4NCjwvZz4NCjxwYXRoIGZpbGw9IiNmZmYiIGlkPSJwdCIgZD0iTS0uMTYyNSwwIDAtLjUgLjE2MjUsMHoiIHRyYW5zZm9ybT0ic2NhbGUoLjA2MTYpIi8+DQo8cGF0aCBmaWxsPSIjYmYwYTMwIiBpZD0ic3RyaXBlIiBkPSJtMCwwaDEyMzV2NTBoLTEyMzV6Ii8+DQo8L2RlZnM+DQo8cGF0aCBmaWxsPSIjZmZmIiBkPSJtMCwwaDEyMzV2NjUwaC0xMjM1eiIvPg0KPHVzZSB4bGluazpocmVmPSIjc3RyaXBlIi8+DQo8dXNlIHk9IjEwMCIgeGxpbms6aHJlZj0iI3N0cmlwZSIvPg0KPHVzZSB5PSIyMDAiIHhsaW5rOmhyZWY9IiNzdHJpcGUiLz4NCjx1c2UgeT0iMzAwIiB4bGluazpocmVmPSIjc3RyaXBlIi8+DQo8dXNlIHk9IjQwMCIgeGxpbms6aHJlZj0iI3N0cmlwZSIvPg0KPHVzZSB5PSI1MDAiIHhsaW5rOmhyZWY9IiNzdHJpcGUiLz4NCjx1c2UgeT0iNjAwIiB4bGluazpocmVmPSIjc3RyaXBlIi8+DQo8cGF0aCBmaWxsPSIjMDAyODY4IiBkPSJtMCwwaDQ5NHYzNTBoLTQ5NHoiLz4NCjx1c2UgeGxpbms6aHJlZj0iI3VuaW9uIiB0cmFuc2Zvcm09Im1hdHJpeCg2NTAgMCAwIDY1MCAyNDcgMTc1KSIvPg0KPC9zdmc+DQo=');
  }
  /* original */
  .lang-none {
    background: url('data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMDAwMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0ODkuMzk0IDQ4OS4zOTQiPgo8cGF0aCBkPSJNMzc1Ljc4OSw5Mi44NjdIMTY2Ljg2NGwxNy41MDctNDIuNzk1YzMuNzI0LTkuMTMyLDEtMTkuNTc0LTYuNjkxLTI1Ljc0NGMtNy43MDEtNi4xNjYtMTguNTM4LTYuNTA4LTI2LjYzOS0wLjg3OSBMOS41NzQsMTIxLjcxYy02LjE5Nyw0LjMwNC05Ljc5NSwxMS40NTctOS41NjMsMTguOTk1YzAuMjMxLDcuNTMzLDQuMjYxLDE0LjQ0NiwxMC43MSwxOC4zNTlsMTQ3LjkyNSw4OS44MjMgYzguNDE3LDUuMTA4LDE5LjE4LDQuMDkzLDI2LjQ4MS0yLjQ5OWM3LjMxMi02LjU5MSw5LjQyNy0xNy4zMTIsNS4yMTktMjYuMjAybC0xOS40NDMtNDEuMTMyaDIwNC44ODYgYzE1LjExOSwwLDI3LjQxOCwxMi41MzYsMjcuNDE4LDI3LjY1NHYxNDkuODUyYzAsMTUuMTE4LTEyLjI5OSwyNy4xOS0yNy40MTgsMjcuMTloLTIyNi43NGMtMjAuMjI2LDAtMzYuNjIzLDE2LjM5Ni0zNi42MjMsMzYuNjIyIHYxMi45NDJjMCwyMC4yMjgsMTYuMzk3LDM2LjYyNCwzNi42MjMsMzYuNjI0aDIyNi43NGM2Mi42NDIsMCwxMTMuNjA0LTUwLjczMiwxMTMuNjA0LTExMy4zNzlWMjA2LjcwOSBDNDg5LjM5NSwxNDQuMDYyLDQzOC40MzEsOTIuODY3LDM3NS43ODksOTIuODY3eiIvPgo8L3N2Zz4=');
    background-color: white;
  }`;
  document.head.appendChild(style);
}

function AddScript() {
  let script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.textContent = `
    function googleTranslateElementInit() {new google.translate.TranslateElement({pageLanguage: 'auto', includedLanguages : 'ko,en,ja'}, 'google_translate_element');}
    document.querySelector('.translation-links').addEventListener('click',function(event) {
      let el = event.target;
      if (el !== null){
        while(el.nodeName == 'FONT' || el.nodeName == 'SPAN') {
          el = el.parentElement;
        }
        let tolang = el.dataset.lang.replace('lang-', '');
        console.log(tolang);
        if ('none' == tolang) {
          let frame = document.getElementById(':1.container');
          if (null !== frame) {
            let btn = frame.contentDocument.getElementById(':1.restore')
            if (null !== btn) { btn.click(); }
            return false;
          }
        }

        const gtcombo = document.querySelector('.goog-te-combo');
        if (gtcombo == null) {
          alert("Error: Could not find Google translate Combolist.");
          return false;
        }
        gtcombo.value = tolang;
        gtcombo.dispatchEvent(new Event('change'));
      }
      return false;
    });
  `;
  document.body.insertBefore(script, document.body.firstElementChild);

  script = document.createElement('script');
  script.setAttribute('src', 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
  document.body.insertBefore(script, document.body.firstElementChild);
}

function AddHtml() {
  let div = document.createElement('div');
  div.setAttribute('id', 'google_translate_element');
  div.style = 'display:none;';
  document.body.insertBefore(div, document.body.firstElementChild);

  div = document.createElement('ul');
  div.setAttribute('class', 'translation-links');

  for (let lang of [{code:'ko', class:'korean', title:'한국어'},
                    {code:'ja', class:'japanese', title:'日本語'},
                    {code:'en', class:'english', title:'English'},
                    {code:'none', class:'none', title:'원본'},]) {
    let span = document.createElement('span');
    span.setAttribute('class', `lang-flag lang-${lang.code}`);
    let a = document.createElement('a');
    a.href = "javascript:void(0)";
    a.setAttribute('class', `type-${lang.class}`);
    a.setAttribute('data-lang', `lang-${lang.code}`);
    a.title = lang.title;
    let li = document.createElement('li');
    a.appendChild(span);
    li.appendChild(a);
    div.appendChild(li);
  }
  document.body.insertBefore(div, document.body.firstElementChild);
}

if (window.top == window.self) {
  AddStyle();
  AddHtml();
  AddScript();
}

})();