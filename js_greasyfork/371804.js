// ==UserScript==
// @name         DragDown to Refesh
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  手机浏览器，下拉刷新，测试中
// @author       You
// @include        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371804/DragDown%20to%20Refesh.user.js
// @updateURL https://update.greasyfork.org/scripts/371804/DragDown%20to%20Refesh.meta.js
// ==/UserScript==

(function(window) {
    var refreshText = document.createElement('p');
    refreshText.id = "refreshText";
    refreshText.style.cssText = "position: absolute; width: 100%; line-height: 50px; text-align: center; left: 0; top: 0; font-size: 3em;";
    document.body.insertBefore(refreshText,document.body.firstChild);

    const SENSITIVE = 250,//达到这个阈值才会刷新
    TIPSHEIGHT = 80;  //这个是显示框宽度
    var _element = document.body,
        // _refreshText = document.querySelector('.refreshText'),
        _refreshText = document.getElementById('refreshText'),
        _startPos = 0,
        _transitionHeight = 0,
        _reloadFlag = 0;
    _element.addEventListener('touchstart', function(e) {
        // console.log('初始位置：', e.touches[0].pageY);
        _startPos = e.touches[0].pageY;
        _element.style.position = 'relative';
        _element.style.transition = 'transform 0s';
    }, false);

    _element.addEventListener('touchmove', function(e) {
        _transitionHeight = e.touches[0].pageY - _startPos;
        if (_transitionHeight > 10) {
            _element.style.transform = 'translateY('+Math.min(TIPSHEIGHT,_transitionHeight)+'px)';
            if(_transitionHeight >= SENSITIVE){
                _refreshText.style.color = "yellowgreen";
            }
            switch(Math.ceil(_transitionHeight/50)){
                case 0:
                _refreshText.innerText = '○○○○○';
                break;
                case 1:
                _refreshText.innerText = '●○○○○';
                break;
                case 2:
                _refreshText.innerText = '●●○○○';
                break;
                case 3:
                _refreshText.innerText = '●●●○○';
                break;
                case 4:
                _refreshText.innerText = '●●●●○';
                break;
                case 5:
                _refreshText.innerText = '●●●●●';
                break;
            };
        }
    }, false);
    _element.addEventListener('touchend', function(e) {
        _element.style.transition = 'transform 0.1s ease 0.2s';
        _element.style.transform = 'translateY(0px)';
        if(_transitionHeight >= SENSITIVE){
            location.reload();
        }
    }, false);
})(window);