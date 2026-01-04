// ==UserScript==
// @name         Better Brunch
// @version      0.1
// @description  Supply a font setting dialog for Brunch
// @author       lqez
// @include      https://brunch.co.kr/*
// @namespace    brunch.co.kr
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/391749/Better%20Brunch.user.js
// @updateURL https://update.greasyfork.org/scripts/391749/Better%20Brunch.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var state = {
        fontFamily: '"Noto Sans KR", sans-serif',
        fontSize: 18,
        contentWidth: 768,
        lineHeight: 1.8,
        letterSpacing: 0,
        colorScheme: 'light'
    };

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    function apply(key) {
        var i, node, nodes;

        if (key == 'colorScheme') {
            node = document.querySelector(".wrap_body_frame");
            if (state.colorScheme == 'dark') {
                node.style.filter = 'invert(0.9)';
            } else {
                node.style.filter = '';
            }

            nodes = document.querySelectorAll(".wrap_body_frame img");

            for (i = 0; i < nodes.length; i++) {
                node = nodes[i];
                if (state.colorScheme == 'dark') {
                    node.style.filter = 'invert(1)';
                } else {
                    node.style.filter = '';
                }
            }

        } else {
            nodes = document.querySelectorAll(".item_type_text");
            for (i = 0; i < nodes.length; i++) {
                node = nodes[i];

                switch(key) {
                    case 'contentWidth':
                        node.style.maxWidth = state.contentWidth + 'px';
                        node.style.width = state.contentWidth + 'px';
                        break;
                }
            }

            nodes = document.querySelectorAll("p.item_type_text");
            for (i = 0; i < nodes.length; i++) {
                node = nodes[i];

                switch(key) {
                    case 'fontFamily':
                        node.style.fontFamily = state.fontFamily;
                        break;
                    case 'fontSize':
                        node.style.fontSize = state.fontSize + 'px';
                        break;
                    case 'lineHeight':
                        node.style.lineHeight = state.lineHeight;
                        break;
                    case 'letterSpacing':
                        node.style.letterSpacing = state.letterSpacing + 'px';
                        break;
                }
            }
        }
    }

    function set(key, value) {
        switch(key) {
            case 'fontFamily':
                state.fontFamily = value;
                break;
            case 'fontSize':
                state.fontSize = parseInt(state.fontSize) + parseInt(value);
                break;
            case 'contentWidth':
                state.contentWidth = parseInt(state.contentWidth) + parseInt(value);
                break;
            case 'lineHeight':
                state.lineHeight = Math.round((parseFloat(state.lineHeight) + parseFloat(value)) * 10) / 10;
                break;
            case 'letterSpacing':
                state.letterSpacing = Math.round((parseFloat(state.letterSpacing) + parseFloat(value)) * 10) / 10;
                break;
            case 'colorScheme':
                state.colorScheme = value;
                break;
        }
        apply(key);
        savePref(key, state[key]);
    }


    function loadPref(key, value) {
        return GM.getValue(key, value).then((v) => {
            if (v != null) {
                state[key] = v;
                apply(key);
            }
        });
    }

    function savePref(key, value) {
        GM.setValue(key, value);
    }

    addGlobalStyle(`
        @font-face { font-family: 'BareunBatang'; font-style: normal; font-weight: 400; src: url('//cdn.jsdelivr.net/korean-webfonts/1/orgs/othrs/kpa/BareunBatang/BareunBatangOTFM.woff2') format('woff2'), url('//cdn.jsdelivr.net/korean-webfonts/1/orgs/othrs/kpa/BareunBatang/BareunBatangOTFM.woff') format('woff'); } @font-face { font-family: 'BareunBatang'; font-style: normal; font-weight: 700; src: url('//cdn.jsdelivr.net/korean-webfonts/1/orgs/othrs/kpa/BareunBatang/BareunBatangOTFB.woff2') format('woff2'), url('//cdn.jsdelivr.net/korean-webfonts/1/orgs/othrs/kpa/BareunBatang/BareunBatangOTFB.woff') format('woff'); } @font-face { font-family: 'BareunBatang'; font-style: normal; font-weight: 300; src: url('//cdn.jsdelivr.net/korean-webfonts/1/orgs/othrs/kpa/BareunBatang/BareunBatangOTFL.woff2') format('woff2'), url('//cdn.jsdelivr.net/korean-webfonts/1/orgs/othrs/kpa/BareunBatang/BareunBatangOTFL.woff') format('woff'); }
        @font-face { font-family: 'RIDIBatang'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_twelve@1.0/RIDIBatang.woff') format('woff'); font-weight: normal; font-style: normal; }
    `);

    addGlobalStyle(`
        @import url('https://fonts.googleapis.com/css?family=Nanum+Gothic|Nanum+Myeongjo|Noto+Serif+KR&display=swap');
        @import url(//fonts.googleapis.com/earlyaccess/kopubbatang.css);

        .bmk {
          position: fixed;
          right: 0;
          top: 60px;
          margin: 12px;
          padding: 6px 8px;
          background: #f1f1f1;
          color: #666;
          border-radius: 50%;
          font-size: 14px;
          cursor: pointer;
          user-select: none;
          z-index: 1000;
        }

        .bmk-row {
          display: flex;
          flex-direction: row;
        }

        .bmk-row + .bmk-row {
            margin-top: 1px;
        }

        .bmk-hidden {
            visibility: hidden;
        }

        .bmk-popup {
            position: fixed;
            right: 48px;
            top: 68px;
            display: flex;
            flex-direction: column;
            background: #ddd;
            border: 1px solid #ddd;
            border-radius: 5px;
            overflow: hidden;
            box-shadow: 0 0.5px 3px 1px rgba(0,0,0,.1);
            z-index: 1001;
        }

        .bmk-button {
            color: #222;
            width: 80px;
            height: 48px;
            font-size: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: white;
            cursor: pointer;
            user-select: none;
            flex-grow:1
        }

        .bmk-button:hover {
            background: #efefef;
        }

        .bmk-button + .bmk-button {
            margin-left: 1px;
        }

        .bmk-line-height {
            display: flex;
            flex-direction: column;
        }
    `);

    document.body.appendChild(new DOMParser().parseFromString(`<div>
        <div class="bmk" id="bmk">Aa</div>
        <div class="bmk-popup bmk-hidden" id="bmk-popup">
            <div class="bmk-row">
                <div class="bmk-button" style="font-family: 'Noto Sans KR', sans-serif" data-key="fontFamily" data-value="">기본</div>
                <div class="bmk-button" style="font-family: 'Noto Serif KR'"
                     data-key="fontFamily" data-value="'Noto Serif', serif">노토세리프</div>
                <div class="bmk-button" style="font-family: 'KoPub Batang'"
                     data-key="fontFamily" data-value="'KoPub Batang', serif">KoPub바탕</div>
            </div>
            <div class="bmk-row">
                <div class="bmk-button" style="font-family: 'RIDIBatang'"
                     data-key="fontFamily" data-value="'RIDIBatang', serif">RIDI바탕</div>
                <div class="bmk-button" style="font-family: 'BareunBatang'"
                     data-key="fontFamily" data-value="'BareunBatang', serif">바른바탕</div>
                <div class="bmk-button" style="font-family: 'Nanum Gothic'"
                     data-key="fontFamily" data-value="'Nanum Gothic', sans-serif">나눔고딕</div>
                <div class="bmk-button" style="font-family: 'Nanum Myeongjo'"
                     data-key="fontFamily" data-value="'Nanum Myeongjo', serif">나눔명조</div>
            </div>
            <div class="bmk-row">
            </div>
            <div class="bmk-row">
                <div class="bmk-button" data-key="fontSize" data-value="+1">&#43;</div>
                <div class="bmk-button" data-key="fontSize" data-value="-1">&#8722;</div>
            </div>
            <div class="bmk-row">
                <div class="bmk-button" data-key="contentWidth" data-value="+40">← →</div>
                <div class="bmk-button" data-key="contentWidth" data-value="-40">→←</div>
            </div>
            <div class="bmk-row">
                <div class="bmk-button" data-key="letterSpacing" data-value="+0.1">A a</div>
                <div class="bmk-button" data-key="letterSpacing" data-value="-0.1">Aa</div>
            </div>
            <div class="bmk-row">
                <div class="bmk-button" data-key="lineHeight" data-value="+0.1">
                    <div class="bmk-line-height" style="line-height: 0.38"><span>—</span><span>—</span><span>—</span></div></div>
                <div class="bmk-button" data-key="lineHeight" data-value="-0.1">
                    <div class="bmk-line-height" style="line-height: 0.25"><span>—</span><span>—</span><span>—</span></div></div>
            </div>
            <div class="bmk-row">
                <div class="bmk-button" data-key="colorScheme" data-value="light">
                    Light ☀️</div>
                <div class="bmk-button" data-key="colorScheme" data-value="dark">
                    Dark 🌙</div>
            </div>
        </div>
    </div>`, 'text/html').getRootNode().body.firstChild);

    document.getElementById("bmk").addEventListener("click", function () {
        var popup = document.getElementById("bmk-popup");
        popup.classList.toggle("bmk-hidden");
    });

    var buttons = document.getElementsByClassName("bmk-button");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function(event) {
            var elem = event.currentTarget;
            var key = elem.getAttribute("data-key");
            var value = elem.getAttribute("data-value");
            set(key, value);
        }, false);
    }

    Object.keys(state).forEach(key => {
        loadPref(key, state[key]);
    });
})();