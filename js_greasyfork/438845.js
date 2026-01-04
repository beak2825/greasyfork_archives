// ==UserScript==
// @name         古诗文网 不弹出登陆界面
// @description  屏蔽古诗文网弹出用户登陆界面，可在我的中登录
// @match        https://*.gushiwen.cn/*
// @version 0.0.1
// @namespace https://greasyfork.org/users/866993
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/438845/%E5%8F%A4%E8%AF%97%E6%96%87%E7%BD%91%20%E4%B8%8D%E5%BC%B9%E5%87%BA%E7%99%BB%E9%99%86%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/438845/%E5%8F%A4%E8%AF%97%E6%96%87%E7%BD%91%20%E4%B8%8D%E5%BC%B9%E5%87%BA%E7%99%BB%E9%99%86%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==

function showErweima(){}

addJS_Node (showErweima);

function addJS_Node (text, s_URL, funcToRun, runOnLoad) {
    var D                                   = document;
    var scriptNode                          = D.createElement ('script');
    if (runOnLoad) {
        scriptNode.addEventListener ("load", runOnLoad, false);
    }
    scriptNode.type                         = "text/javascript";
    if (text)       scriptNode.textContent  = text;
    if (s_URL)      scriptNode.src          = s_URL;
    if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';

    var targ = D.getElementsByTagName ('html')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}