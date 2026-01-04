// ==UserScript==
// @name         CookieHelper
// @namespace    https://github.com/cloudswave
// @version      0.1.7
// @description  GM_cookie test
// @author       ethan
// @match        *://*/*
// @grant        GM_cookie
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479512/CookieHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/479512/CookieHelper.meta.js
// ==/UserScript==

var panel = document.createElement('div');
var getListBtn = document.createElement('div');
var setBtn = document.createElement('div');
var deleteBtn = document.createElement('div');
var ui = [panel,getListBtn,setBtn,deleteBtn];
function showPanel(show){
    if(show) panel.style.display = 'block';
    else panel.style.display = 'none';
}
function showLog(str){
    showPanel(true);
    panel.innerHTML += str + "<br>";
    console.log(str);
}

function getCookieList(){
    try{
        showLog(`start GM_cookie.list`);
        GM_cookie.list({}, (cookies, error) => {
            if(error) {
                showLog(`error:${error}`);
                return;
            }
            showLog(`cookies:${cookies}`);
            if(!cookies) {
                return;
            }
            let cookieStr = "";
            for (let i = 0; i < cookies.length; i++) {
                cookieStr += `${cookies[i].name}=${cookies[i].value};`;
            }
            showLog(cookieStr == "" ? "no cookie" : cookieStr);
        });
    } catch(e){
        showLog(`error:${e}`);
    }
}

function setCookieTest(){
    let cookie = {
          name: 'test',
          value: '123',
          path: '/',
          expirationDate: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30) // Expires in 30 days
    };
    showLog(`start GM_cookie.set cookie ${JSON.stringify(cookie)}`);
    GM_cookie.set(cookie, function(error) {
          if (error) {
            showLog(`error:${error}`);
          } else {
            showLog('Cookie set successfully.');
          }
    });
}

function delCookieTest(){
    showLog(`start GM_cookie.delete cookie test`);
    GM_cookie.delete({ name: 'test' }, function(error) {
        if (error) {
            showLog(`error:${error}`);
        } else {
            showLog('Cookie deleted successfully');
        }
    });
}


function createUI() {
	// 创建悬浮按钮
    let btnStyle = "font-size:small;background: red;position: fixed;bottom: 60px;right: 20px;color: white;z-index: 9999;padding: 5px;";
	getListBtn.innerHTML = 'GM_cookie.list';
    getListBtn.style = btnStyle;
    getListBtn.style.bottom = "130px";
	document.body.appendChild(getListBtn);

    setBtn.innerHTML = 'GM_cookie.set';
    setBtn.style = btnStyle;
    setBtn.style.bottom = "95px";
	document.body.appendChild(setBtn);

    deleteBtn.innerHTML = 'GM_cookie.delete';
    deleteBtn.style = btnStyle;
    deleteBtn.style.bottom = "60px";
	document.body.appendChild(deleteBtn);

	// 创建浮层
	panel.innerHTML = '';
	panel.style = "font-size:small;position: fixed; bottom: 0px; width: 60%; max-height: 90%; background-color: rgba(0, 0, 0, 0.8); color: white; padding: 20px; z-index: 10000; display: none; word-wrap: break-word; overflow-y: auto;"
	document.body.appendChild(panel);

	// 按钮点击事件监听
	getListBtn.addEventListener('click', getCookieList);
	setBtn.addEventListener('click', setCookieTest);
	deleteBtn.addEventListener('click', delCookieTest);
	// 点击浮层外部隐藏浮层
	document.addEventListener('click', function(e) {
        for (let i = 0; i < ui.length; i++) {
            if(e.target === ui[i]) return;
        }
        showPanel(false);
	});
}
(function() {
	'use strict';
	createUI();
})();