// ==UserScript==
// @name         Youtube Repeat button
// @namespace    
// @version      0.1.6
// @description  Youtube動画プレイヤーにリピートボタンをつける(html5プレイヤーのみ動作)
// @author       Nobby
// @include      https://youtube.com/*
// @include      https://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/13924/Youtube%20Repeat%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/13924/Youtube%20Repeat%20button.meta.js
// ==/UserScript==

(function(){
    var addRepeatButton = function(){
        var player = document.getElementsByClassName('html5-video-player')[0];
        var video = document.querySelector('video');
        var repeat = GM_getValue('rpt',false);
        var control = document.getElementsByClassName('ytp-chrome-controls')[0];
        var yrb = document.createElement('button');
        var title = 'リピート';
        yrb.setAttribute('class', 'ytp-button ytp-repeat-button');
        yrb.setAttribute('style', 'float:right;');

        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '-128 -128 768 768');

        var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

        var from = 'M363 363v0h0v0h0v0l0-0 0-0v0h0zM149 149v0h0v0h0v0l0 0-0 0v0h0zM469 256l-85 85v-64H64v-42h320v-64l85 85z';
        var to = 'M363 363v-86h42v128H149v64l-85-85 85-85v64h214zM149 149v86h-42V107h256V43l85 85-85 85v-64H149zM256 256l-0 0v-0H256v-0h0v-0l0 0z';

        if(repeat){
            from = [to, to = from][0];
            video.setAttribute('loop', '');
            title = 'リピート解除';
        }
        yrb.setAttribute('title', title);

        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('id', 'ytp-repeat');
        path.setAttribute('d', from);

        var animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animate.setAttribute('attributeType', 'XML');
        animate.setAttribute('attributeName', 'd');
        animate.setAttribute('fill', 'freeze');
        animate.setAttribute('dur', '0.2s');
        animate.setAttribute('keySplines', '.4 0 1 1');
        animate.setAttribute('repeatCount', '1');
        animate.setAttribute('begin', 'indefinite');

        var use1 = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use1.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#ytp-repeat');
        use1.setAttribute('class', 'ytp-svg-shadow');

        var use2 = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use2.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#ytp-repeat');
        use2.setAttribute('class', 'ytp-svg-fill');

        path.appendChild(animate);
        defs.appendChild(path);
        svg.appendChild(defs);
        svg.appendChild(use1);
        svg.appendChild(use2);
        yrb.appendChild(svg);

        control.appendChild(yrb);

        var tooltext = document.getElementsByClassName('ytp-tooltip-text')[0];
        var tooltip = tooltext.parentNode.parentNode;

        var delay = null;

        yrb.addEventListener('mouseover', function(){
            yrb.removeAttribute('title');
            tooltip.setAttribute('aria-hidden', 'true');
            tooltip.setAttribute('class', 'ytp-tooltip ytp-bottom');
            delay = setTimeout(function() { 
                tooltip.style.display = '';
                tooltext.textContent = title;
                var parentRect = player.getBoundingClientRect();
                var childRect = yrb.getBoundingClientRect();
                var tipRect = tooltip.getBoundingClientRect();
                var x_left = childRect.left - parentRect.left + (childRect.width - tipRect.width)/2;
                tooltip.setAttribute('style', 'left:'+x_left+'px');
                tooltip.removeAttribute('aria-hidden');
            }, 500);
        }, false);

        yrb.addEventListener('mouseleave', function(){
            clearTimeout(delay);
            tooltip.style.display = 'none';
            tooltip.setAttribute('aria-hidden', 'true');
            yrb.setAttribute('title', title);
        }, false);

        yrb.addEventListener('click', function(){ 
            if(repeat){
                video.removeAttribute('loop');
                title = 'リピート';
            }else{
                video.setAttribute('loop', '');
                title = 'リピート解除';
            }
            repeat = !repeat;
            tooltext.textContent = title;
            var parentRect = player.getBoundingClientRect();
            var childRect = yrb.getBoundingClientRect();
            var tipRect = tooltip.getBoundingClientRect();
            var x_left = childRect.left - parentRect.left + (childRect.width - tipRect.width)/2;
            tooltip.setAttribute('style', 'left:'+x_left+'px');
            setTimeout(function() { 
                animate.setAttribute('from', from);
                animate.setAttribute('to', to);
                animate.beginElement();
                path.setAttribute('d', to);
                from = [to, to = from][0];
            }, 50);
        }, false);

        window.onbeforeunload = function(){
            GM_setValue('rpt',repeat);
        };
    };
    
    var observer = new MutationObserver(function(mutations){
        if(location.href.match(/youtube\.com\/(?:watch|embed)/)){
            addRepeatButton();
            observer.disconnect();
        }
    });

    var target = document.body;
    observer.observe(target, {childList:true});
})();